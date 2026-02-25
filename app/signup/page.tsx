"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-14">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Start with the Student plan and upgrade anytime.</p>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setSuccess(null);
            setLoading(true);

            const formData = new FormData(e.currentTarget);
            const email = String(formData.get("email") || "");
            const password = String(formData.get("password") || "");

            try {
              const supabase = createSupabaseBrowserClient();
              const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
              if (signUpError) {
                setError(signUpError.message);
                return;
              }

              if (data.session) {
                router.replace("/app");
                router.refresh();
                return;
              }

              setSuccess("Account created. Check your email to confirm, then log in.");
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
          </div>
          {error ? <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-red-700">{error}</div> : null}
          {success ? <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm">{success}</div> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating…" : "Create account"}
          </Button>
        </form>

        <div className="mt-6 text-sm text-muted-foreground">
          Already have an account? <Link href="/login">Log in</Link>.
        </div>
      </Card>
    </div>
  );
}
