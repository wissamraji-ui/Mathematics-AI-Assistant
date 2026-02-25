import { createSupabaseServiceClient } from "@/lib/supabase/server";
import type { Plan } from "@/lib/policy";

export async function getUserPlan(userId: string): Promise<Plan> {
  const service = createSupabaseServiceClient();
  const { data } = await service
    .from("subscriptions")
    .select("plan,status,current_period_end")
    .eq("user_id", userId)
    .in("status", ["active", "trialing"])
    .order("current_period_end", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data?.plan) return "free";
  if (data.plan === "pro") return "pro";
  if (data.plan === "student") return "student";
  return "free";
}

