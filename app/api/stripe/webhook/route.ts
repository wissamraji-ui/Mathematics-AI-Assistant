import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createStripeClient } from "@/lib/stripe";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { getRequiredEnv } from "@/lib/env";

export const runtime = "nodejs";

async function upsertFromSubscription(input: {
  userId: string;
  plan: "student" | "pro";
  customerId: string;
  subscription: Stripe.Subscription;
}) {
  const service = createSupabaseServiceClient();
  await service
    .from("subscriptions")
    .upsert(
      {
        user_id: input.userId,
        stripe_customer_id: input.customerId,
        stripe_subscription_id: input.subscription.id,
        plan: input.plan,
        status: input.subscription.status,
        current_period_end: new Date(input.subscription.current_period_end * 1000).toISOString(),
      },
      { onConflict: "user_id" },
    );
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

  const body = await request.text();
  const stripe = createStripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, getRequiredEnv("STRIPE_WEBHOOK_SECRET"));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan as "student" | "pro" | undefined;
      const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
      const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

      if (userId && plan && customerId && subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await upsertFromSubscription({ userId, plan, customerId, subscription });
      }
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

      const service = createSupabaseServiceClient();
      const { data } = await service.from("subscriptions").select("user_id,plan").eq("stripe_customer_id", customerId).maybeSingle();

      if (data?.user_id && (data.plan === "student" || data.plan === "pro")) {
        await upsertFromSubscription({
          userId: data.user_id,
          plan: data.plan,
          customerId,
          subscription,
        });
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook handler failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

