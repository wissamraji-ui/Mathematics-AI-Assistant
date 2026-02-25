import { NextResponse } from "next/server";
import { z } from "zod";
import { createStripeClient, getAppUrl } from "@/lib/stripe";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const BodySchema = z.object({
  plan: z.enum(["student", "pro"]),
});

function priceIdForPlan(plan: "student" | "pro") {
  if (plan === "student") return process.env.STRIPE_PRICE_ID_STUDENT;
  return process.env.STRIPE_PRICE_ID_PRO;
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const priceId = priceIdForPlan(parsed.data.plan);
  if (!priceId) return NextResponse.json({ error: "Missing Stripe price env vars" }, { status: 500 });

  const stripe = createStripeClient();
  const service = createSupabaseServiceClient();

  const { data: existing } = await service.from("subscriptions").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();

  const customerId =
    existing?.stripe_customer_id ||
    (
      await stripe.customers.create({
        email: user.email || undefined,
        metadata: { userId: user.id },
      })
    ).id;

  if (!existing?.stripe_customer_id) {
    await service
      .from("subscriptions")
      .upsert(
        {
          user_id: user.id,
          stripe_customer_id: customerId,
          plan: parsed.data.plan,
          status: "incomplete",
        },
        { onConflict: "user_id" },
      );
  }

  const appUrl = getAppUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/app/billing?success=1`,
    cancel_url: `${appUrl}/app/billing?canceled=1`,
    metadata: {
      userId: user.id,
      plan: parsed.data.plan,
    },
  });

  if (!session.url) return NextResponse.json({ error: "Stripe session missing URL" }, { status: 500 });
  return NextResponse.json({ url: session.url });
}

