"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-140px] h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/20 via-sky-200/40 to-cyan-200/40 blur-3xl" />
      </div>

      <div className="container grid gap-10 py-14 lg:grid-cols-2 lg:items-center">
        <div className="hidden space-y-6 lg:block">
          <div className="flex items-center gap-2">
            <Badge>Welcome back</Badge>
            <div className="text-sm text-muted-foreground">Proof-first • Hint ladder • Course-aligned</div>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">Pick up where you left off.</h1>
          <p className="text-muted-foreground">
            Keep learning with structured hints, proof outlines, and citations to your course notes.
          </p>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-primary" />
              Tutor Mode: Socratic prompts + hint ladder
            </div>
            <div className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-primary" />
              Proof Trainer: structure checks + next lemma
            </div>
            <div className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-primary" />
              Exam Practice: generate problems by topic/difficulty
            </div>
          </div>
        </div>

        <Card className="w-full max-w-md p-7 lg:justify-self-end">
          <h2 className="text-2xl font-semibold">Log in</h2>
          <p className="mt-2 text-sm text-muted-foreground">Use your email and password.</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setLoading(true);

              const formData = new FormData(e.currentTarget);
              const email = String(formData.get("email") || "");
              const password = String(formData.get("password") || "");

              try {
                const supabase = createSupabaseBrowserClient();
                const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
                if (signInError) {
                  setError(signInError.message);
                  return;
                }
                const next = searchParams.get("next");
                router.replace(next || "/app");
                router.refresh();
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
              <Input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>

            {error ? <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-red-700">{error}</div> : null}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-sm text-muted-foreground">
            No account? <Link href="/signup">Sign up</Link>.
          </div>
        </Card>
      </div>
    </div>
  );
}
