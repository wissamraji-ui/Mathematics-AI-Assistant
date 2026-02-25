import Link from "next/link";
import { ArrowRight, BookOpen, Building2, Check, GraduationCap, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-140px] h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/20 via-sky-200/40 to-cyan-200/40 blur-3xl" />
        <div className="absolute right-[-120px] top-[180px] h-[260px] w-[260px] rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute bottom-[-140px] left-[-140px] h-[320px] w-[320px] rounded-full bg-cyan-200/20 blur-2xl" />
      </div>

      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Beta</Badge>
              <div className="text-sm text-muted-foreground">Proof-first • Hint ladder • Course-aligned</div>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              A proof-oriented math tutor that helps you learn (not cheat).
            </h1>

            <p className="text-lg text-muted-foreground">
              Structured hints, proof outlines, and pedagogy-aligned guidance—powered by a curated knowledge base (your
              notes) + an LLM.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">
                  Start learning <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/pricing">See pricing</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3" />
                </span>
                Integrity-first by default
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3" />
                </span>
                KaTeX math rendering
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3" />
                </span>
                Citations to your notes
              </div>
            </div>
          </div>

          <Card className="p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Hint ladder (Tutor Mode)</div>
              <Badge variant="default">Try the rungs</Badge>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-muted/60 p-4">
                <div className="text-xs text-muted-foreground">Student</div>
                <div className="mt-1 text-sm font-medium">Prove: every Cauchy sequence in ℝ converges.</div>
              </div>

              <div className="rounded-xl border bg-background p-4">
                <div className="text-xs text-muted-foreground">Assistant</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Idea:</span> connect the definition of Cauchy to
                  completeness of ℝ and show the sequence is bounded with a convergent subsequence.
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Button size="sm">Give me a small hint</Button>
                <Button size="sm" variant="secondary">
                  Give me a bigger hint
                </Button>
                <Button size="sm" variant="secondary">
                  Show proof outline
                </Button>
                <Button size="sm" variant="secondary">
                  Show full solution (if allowed)
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                Full solutions can require your attempt or a higher tier subscription.
              </div>
            </div>
          </Card>
        </div>

        <section id="how-it-works" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Built like a modern study tool: your course notes become the assistant’s source of truth, and the chat
            experience is designed around hints and proof structure.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">1</div>
              <div className="mt-4 font-medium">Choose mode + rigor</div>
              <p className="mt-2 text-sm text-muted-foreground">Tutor, Proof Trainer, or Exam Practice with rigor control.</p>
            </Card>
            <Card className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">2</div>
              <div className="mt-4 font-medium">Ask + attempt</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Paste your proof attempt to get targeted feedback and responsibly unlock more help.
              </p>
            </Card>
            <Card className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">3</div>
              <div className="mt-4 font-medium">Get cited guidance</div>
              <p className="mt-2 text-sm text-muted-foreground">The assistant retrieves relevant chunks from your notes and cites them.</p>
            </Card>
          </div>
        </section>

        <section className="mt-16">
          <div className="grid gap-6 rounded-2xl border bg-muted/40 p-6 md:grid-cols-3 md:items-center">
            <div className="md:col-span-2">
              <div className="text-sm font-medium">MVP course</div>
              <div className="mt-1 text-sm text-muted-foreground">Real Analysis I</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className="gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  Tutor Mode
                </Badge>
                <Badge className="gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Integrity-first
                </Badge>
                <Badge className="gap-2">
                  <BookOpen className="h-3.5 w-3.5" />
                  Notes citations
                </Badge>
              </div>
            </div>
            <div className="md:text-right">
              <Button asChild variant="secondary">
                <Link href="/courses">Browse courses</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">Who it’s for</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Start with university students for fast feedback and revenue, expand to graduate courses, then offer
            institutional licensing.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center gap-2 font-medium">
                <Users className="h-5 w-5 text-primary" />
                University students
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Understandable explanations, proof structure, and exam practice.
              </p>
              <div className="mt-3 text-xs text-muted-foreground">Typical spend: $7–15/month</div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-2 font-medium">
                <GraduationCap className="h-5 w-5 text-primary" />
                Graduate students
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Deep theory, proof techniques, and reading assistance.
              </p>
              <div className="mt-3 text-xs text-muted-foreground">Typical spend: $15–30/month (or per-course)</div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-2 font-medium">
                <Building2 className="h-5 w-5 text-primary" />
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

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">Ready to try it with your course?</div>
            <div className="flex gap-3">
              <Button asChild variant="secondary">
                <Link href="/pricing">Compare plans</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Create account</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
