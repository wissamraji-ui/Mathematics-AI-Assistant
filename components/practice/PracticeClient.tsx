"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MathMarkdown } from "@/components/math/MathMarkdown";
import { Badge } from "@/components/ui/badge";

type Difficulty = "easy" | "medium" | "hard";

type Citation = {
  chunkId: string;
  documentTitle?: string;
  section?: string;
  page?: number;
  similarity?: number;
};

export function PracticeClient() {
  const [courseId, setCourseId] = useState("real-analysis-1");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [problem, setProblem] = useState<string | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);

  const chatHref = useMemo(() => {
    if (!problem) return "/app/chat";
    const params = new URLSearchParams();
    params.set("mode", "exam");
    params.set("question", `Practice problem:\n\n${problem}\n\nPlease help me solve this using the hint ladder.`);
    return `/app/chat?${params.toString()}`;
  }, [problem]);

  async function generate() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/practice/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ courseId, topic: topic || null, difficulty }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { problem: string; citations?: Citation[] };
      setProblem(data.problem);
      setCitations(data.citations || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Practice</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Generate exam-style practice problems by topic and difficulty, aligned to your course notes. Then solve with
            the hint ladder.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Exam Practice
          </Badge>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <div className="text-sm font-medium">Generator</div>
          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <Label>Course</Label>
              <select
                className="h-10 w-full rounded-md border bg-background px-3 text-sm shadow-sm focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                <option value="real-analysis-1">Real Analysis I</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="topic">Topic (optional)</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Cauchy sequences, uniform continuity"
              />
            </div>

            <div className="space-y-1">
              <Label>Difficulty</Label>
              <select
                className="h-10 w-full rounded-md border bg-background px-3 text-sm shadow-sm focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <Button onClick={generate} size="lg" disabled={loading}>
              {loading ? "Generating…" : "Generate problem"}
            </Button>

            {error ? <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-red-700">{error}</div> : null}

            <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
              Integrity-first: this generator won’t dump full worked solutions by default. Use the hint ladder in chat.
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-medium">Problem</div>
              <div className="mt-1 text-xs text-muted-foreground">Generated for practice (not graded).</div>
            </div>
            <Button asChild variant="secondary" disabled={!problem}>
              <Link href={chatHref}>Solve in chat (hint ladder)</Link>
            </Button>
          </div>

          <div className="mt-5">
            {problem ? (
              <MathMarkdown content={problem} />
            ) : (
              <div className="text-sm text-muted-foreground">Generate a problem to begin.</div>
            )}
          </div>

          {citations.length ? (
            <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
              <div className="font-medium text-foreground">Based on notes</div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {citations.map((c) => (
                  <li key={c.chunkId}>
                    {c.documentTitle ? `${c.documentTitle}` : "Notes"} {c.section ? `· ${c.section}` : ""}{" "}
                    {typeof c.page === "number" ? `· p.${c.page}` : ""}{" "}
                    {typeof c.similarity === "number" ? `· sim ${c.similarity.toFixed(3)}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
