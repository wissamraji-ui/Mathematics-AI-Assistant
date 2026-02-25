import { BillingClient } from "@/components/billing/BillingClient";

export default function BillingPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
      <p className="mt-2 text-sm text-muted-foreground">Manage your plan and subscription.</p>

      <div className="mt-8">
        <BillingClient />
      </div>
    </div>
  );
}
