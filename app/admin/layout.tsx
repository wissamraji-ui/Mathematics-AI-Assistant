import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

async function isAdmin() {
  const user = await getCurrentUser();
  if (!user) return false;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("users").select("role").eq("id", user.id).maybeSingle();
  return data?.role === "admin";
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ok = await isAdmin();

  if (!ok) {
    return (
      <div className="container py-14">
        <Card className="p-6">
          <div className="text-lg font-medium">Admin access required</div>
          <p className="mt-2 text-sm text-muted-foreground">
            If you are the owner, set your role to <code>admin</code> in the <code>users</code> table.
          </p>
          <div className="mt-4 text-sm">
            <Link href="/app">Go back to app</Link>
          </div>
        </Card>
      </div>
    );
  }

  return <div>{children}</div>;
}
