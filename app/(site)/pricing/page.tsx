import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  return (
    <div className="container py-14">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Learning-first plans built around hints, proof structure, and course-aligned guidance.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">Cancel anytime.</div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="p-7">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Student</div>
              <div className="mt-2 flex items-end gap-2">
                <div className="text-4xl font-semibold">$9.99</div>
                <div className="pb-1 text-sm text-muted-foreground">/ month</div>
              </div>
            </div>
          </div>

          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-primary" /> 1–2 course assistants
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-primary" /> Hint ladder tutoring + exam practice
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-primary" /> Rigor level selector
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-primary" /> Daily message limits
            </li>
          </ul>

          <Button className="mt-7 w-full" size="lg" asChild>
            <Link href="/signup">Start Student</Link>
          </Button>
        </Card>

        <Card className="relative overflow-hidden p-7">
          <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-sky-400 to-cyan-400" />
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-muted-foreground">Pro</div>
                <Badge variant="default">Most popular</Badge>
              </div>
              <div className="mt-2 flex items-end gap-2">
                <div className="text-4xl font-semibold">$19.99</div>
                <div className="pb-1 text-sm text-muted-foreground">/ month</div>
              </div>
            </div>
          </div>

          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-primary" /> All courses
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-primary" /> Proof Trainer mode (structure + next lemma)
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-primary" /> Higher limits
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-primary" /> Solution unlock after attempt (integrity-first)
            </li>
          </ul>

          <Button className="mt-7 w-full" size="lg" variant="secondary" asChild>
            <Link href="/signup">Start Pro</Link>
          </Button>
        </Card>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Semester plan</div>
          <div className="mt-2 text-lg font-semibold">$29–$49</div>
          <div className="mt-1 text-sm text-muted-foreground">per semester (coming soon)</div>
          <p className="mt-4 text-sm text-muted-foreground">
            A fixed-term option for students who prefer semester billing.
          </p>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Per-course assistants</div>
          <div className="mt-2 text-lg font-semibold">$25–$49</div>
          <div className="mt-1 text-sm text-muted-foreground">per course/semester (coming soon)</div>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Real Analysis I Tutor — $25/semester</li>
            <li>Abstract Algebra Tutor — $25/semester</li>
            <li>Modular Forms (Grad) — $49/semester</li>
          </ul>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Institutional licensing</div>
          <div className="mt-2 text-lg font-semibold">$1k–$5k</div>
          <div className="mt-1 text-sm text-muted-foreground">per year (later)</div>
          <p className="mt-4 text-sm text-muted-foreground">
            Department seats, usage visibility, and course-specific assistants.
          </p>
        </Card>
      </div>

      <div className="mt-10 rounded-xl border bg-muted/40 p-6">
        <div className="text-sm font-medium">Add-ons</div>
        <div className="mt-2 text-sm text-muted-foreground">Exam Pack — $9.99/semester (coming soon)</div>
      </div>

      <div className="mt-10 text-sm text-muted-foreground">
        By using the platform, you agree it is a study aid and not a guarantee of grades. See{" "}
        <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy</Link>.
      </div>
    </div>
  );
}
