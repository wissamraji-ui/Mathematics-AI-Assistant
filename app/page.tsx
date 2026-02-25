import Link from "next/link";
import { ArrowRight, Building2, GraduationCap, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="container py-14">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            Proof-first tutoring. Hint ladder. Course-aligned notes.
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            A proof-oriented math tutor that helps you learn (not cheat).
          </h1>
          <p className="text-lg text-muted-foreground">
            Structured hints, proof outlines, and pedagogy-aligned guidance—powered by a curated knowledge base (your
            notes) + an LLM.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/signup">
                Get started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-2 font-medium">
              <GraduationCap className="h-5 w-5" />
              Hint ladder tutoring
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Hint 1 → Hint 2 → Outline → (Optional) full solution, aligned to academic integrity.
            </p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="h-5 w-5" />
              Integrity safeguards
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Default: no instant solutions. “Show after attempt” rules and exam-mode restrictions.
            </p>
          </Card>
          <Card className="p-5 sm:col-span-2">
            <div className="flex items-center gap-2 font-medium">
              <Sparkles className="h-5 w-5" />
              Proof-first rigor control
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose intro / intermediate / honors / graduate. The assistant prioritizes definitions, theorem statements,
              and proof structure.
            </p>
          </Card>
        </div>
      </div>

      <div className="mt-14 grid gap-4 rounded-2xl border border-border bg-muted p-6 sm:grid-cols-3">
        <div>
          <div className="text-sm font-medium">MVP course</div>
          <div className="mt-1 text-sm text-muted-foreground">Real Analysis I</div>
        </div>
        <div>
          <div className="text-sm font-medium">Modes</div>
          <div className="mt-1 text-sm text-muted-foreground">Tutor · Proof Trainer · Exam Practice</div>
        </div>
        <div className="sm:text-right">
          <Button asChild variant="secondary">
            <Link href="/courses">Browse courses</Link>
          </Button>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Who it’s for</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Start with university students for fast feedback and revenue, expand to graduate courses, then offer
          institutional licensing.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center gap-2 font-medium">
              <Users className="h-5 w-5" />
              University students
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Understandable explanations, proof structure, and exam practice.
            </p>
            <div className="mt-3 text-xs text-muted-foreground">Typical spend: $7–15/month</div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 font-medium">
              <GraduationCap className="h-5 w-5" />
              Graduate students
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Deep theory, proof techniques, and reading assistance.
            </p>
            <div className="mt-3 text-xs text-muted-foreground">Typical spend: $15–30/month (or per-course)</div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 font-medium">
              <Building2 className="h-5 w-5" />
              Institutions (later)
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Admin seats, usage visibility, and course-specific assistants.
            </p>
            <div className="mt-3 text-xs text-muted-foreground">Typical spend: $500–$5000/year</div>
          </Card>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Why it’s different</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Most “math AI” is computational, solution-dumping, and weak on proofs. This platform is built for learning.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <div className="font-medium">Proof-first</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Prioritizes definitions, theorem statements, and clean proof structure.
            </p>
          </Card>
          <Card className="p-6">
            <div className="font-medium">Hint ladder</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Hint 1 → Hint 2 → Outline → Full solution (only when allowed).
            </p>
          </Card>
          <Card className="p-6">
            <div className="font-medium">Rigor control</div>
            <p className="mt-2 text-sm text-muted-foreground">Intro / intermediate / honors / graduate.</p>
          </Card>
          <Card className="p-6">
            <div className="font-medium">Course-aligned</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Uses your notes, your definitions, and your preferred style—with citations.
            </p>
          </Card>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Academic integrity</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Learning-first defaults: no full solution immediately. The assistant encourages attempts and supports
          responsible studying.
        </p>
        <Card className="mt-6 p-6">
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Default: hints first (no instant full solutions).</li>
            <li>“Show solution after attempt” and tier-based unlocks.</li>
            <li>Exam-mode restrictions and refusal for active graded cheating requests.</li>
            <li>Optional Teacher Mode for instructors (coming soon).</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
