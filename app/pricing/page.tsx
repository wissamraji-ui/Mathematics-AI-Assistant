import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PricingPage() {
  return (
    <div className="container py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Learning-first plans built around hints, proof structure, and course-aligned guidance.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Student</div>
          <div className="mt-2 text-4xl font-semibold">$9.99</div>
          <div className="mt-1 text-sm text-muted-foreground">per month</div>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-sm">
            <li>1–2 course assistants</li>
            <li>Hint ladder + exam practice</li>
            <li>Rigor level selector</li>
            <li>Daily message limits</li>
          </ul>
          <Button className="mt-6 w-full" asChild>
            <Link href="/signup">Start Student</Link>
          </Button>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Pro</div>
          <div className="mt-2 text-4xl font-semibold">$19.99</div>
          <div className="mt-1 text-sm text-muted-foreground">per month</div>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-sm">
            <li>All courses</li>
            <li>Proof Trainer mode</li>
            <li>Exam practice</li>
            <li>Higher daily limits</li>
            <li>Solution unlock after attempt</li>
          </ul>
          <Button className="mt-6 w-full" variant="secondary" asChild>
            <Link href="/signup">Start Pro</Link>
          </Button>
        </Card>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
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

      <div className="mt-10 rounded-xl border border-border bg-muted p-6">
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
