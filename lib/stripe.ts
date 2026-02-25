import Stripe from "stripe";
import { getRequiredEnv } from "@/lib/env";

export function createStripeClient() {
  return new Stripe(getRequiredEnv("STRIPE_SECRET_KEY"), {
    apiVersion: "2024-06-20",
  });
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

