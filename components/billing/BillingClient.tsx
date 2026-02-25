"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Plan = "student" | "pro";

export function BillingClient() {
  const searchParams = useSearchParams();
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  async function startCheckout(plan: Plan) {
    setError(null);
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { url: string };
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setLoadingPlan(null);
    }
  }

  async function openPortal() {
    setError(null);
    try {
      const res = await fetch("/api/stripe/create-portal-session", { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { url: string };
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Portal failed");
    }
  }

  return (
    <div className="space-y-4">
      {success ? <Card className="border-green-300 p-4 text-sm">Subscription successful.</Card> : null}
      {canceled ? <Card className="border-yellow-300 p-4 text-sm">Checkout canceled.</Card> : null}
      {error ? <Card className="border-red-300 p-4 text-sm text-red-700">{error}</Card> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="font-medium">Student</div>
          <div className="mt-2 text-sm text-muted-foreground">$9.99/month · 1–2 courses</div>
          <Button className="mt-5" onClick={() => startCheckout("student")} disabled={loadingPlan !== null}>
            {loadingPlan === "student" ? "Redirecting…" : "Subscribe"}
          </Button>
        </Card>
        <Card className="p-6">
          <div className="font-medium">Pro</div>
          <div className="mt-2 text-sm text-muted-foreground">$19.99/month · all courses</div>
          <Button className="mt-5" variant="secondary" onClick={() => startCheckout("pro")} disabled={loadingPlan !== null}>
            {loadingPlan === "pro" ? "Redirecting…" : "Subscribe"}
          </Button>
        </Card>
      </div>

      <Card className="p-6">
        <div className="font-medium">Manage subscription</div>
        <p className="mt-2 text-sm text-muted-foreground">Open the Stripe customer portal to update or cancel.</p>
        <Button className="mt-5" variant="ghost" onClick={openPortal}>
          Open portal
        </Button>
      </Card>
    </div>
  );
}
