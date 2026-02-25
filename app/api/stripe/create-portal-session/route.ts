import { NextResponse } from "next/server";
import { createStripeClient, getAppUrl } from "@/lib/stripe";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = createSupabaseServiceClient();
  const { data } = await service.from("subscriptions").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();

  if (!data?.stripe_customer_id) {
    return NextResponse.json({ error: "No Stripe customer found. Start a subscription first." }, { status: 400 });
  }

  const stripe = createStripeClient();
  const session = await stripe.billingPortal.sessions.create({
    customer: data.stripe_customer_id,
    return_url: `${getAppUrl()}/app/billing`,
  });

  return NextResponse.json({ url: session.url });
}

