"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MathMarkdown } from "@/components/math/MathMarkdown";
import { Badge } from "@/components/ui/badge";

type ChatMode = "tutor" | "proof-trainer" | "exam";
type RigorLevel = "intro" | "intermediate" | "honors" | "graduate";

type Citation = {
  chunkId: string;
  documentTitle?: string;
  section?: string;
  page?: number;
  similarity?: number;
};

type ChatTurn = {
  id: string;
  question: string;
  answer: string;
  citations: Citation[];
  hintLevel: number;
  createdAt: string;
};

function clampHintLevel(level: number) {
  return Math.max(1, Math.min(4, level));
}

export function ChatClient() {
  const [courseId, setCourseId] = useState("real-analysis-1");
  const [mode, setMode] = useState<ChatMode>("tutor");
  const [rigor, setRigor] = useState<RigorLevel>("intermediate");
  const [attempt, setAttempt] = useState("");

  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const seededQuestion = searchParams.get("question");
    const seededMode = searchParams.get("mode") as ChatMode | null;
    if (seededMode && ["tutor", "proof-trainer", "exam"].includes(seededMode)) {
      setMode(seededMode);
    }
    if (seededQuestion && !input) {
      setInput(seededQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const lastTurn = turns.at(-1);

  const history = useMemo(() => {
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [];
    for (const turn of turns.slice(-6)) {
      messages.push({ role: "user", content: turn.question });
      if (turn.answer) messages.push({ role: "assistant", content: turn.answer });
    }
    return messages;
  }, [turns]);

  async function runTurn(question: string, hintLevel: number, turnId?: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: question,
          courseId,
          mode,
          rigor,
          hintLevel,
          attempt: attempt || null,
          history,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }

      const data = (await res.json()) as { answer: string; citations?: Citation[] };

      setTurns((prev) => {
        const now = new Date().toISOString();
        if (turnId) {
          return prev.map((t) =>
            t.id === turnId
              ? { ...t, answer: data.answer, citations: data.citations || [], hintLevel: clampHintLevel(hintLevel) }
              : t,
          );
        }
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            question,
            answer: data.answer,
            citations: data.citations || [],
            hintLevel: clampHintLevel(hintLevel),
            createdAt: now,
          },
        ];
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Chat</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ask a proof question and climb the hint ladder.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            {mode === "tutor" ? "Tutor Mode" : mode === "proof-trainer" ? "Proof Trainer" : "Exam Practice"}
          </Badge>
          <Badge>Rigor: {rigor}</Badge>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="p-6">
          <div className="text-sm font-medium">Session</div>
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
              <Label>Mode</Label>
              <select
                className="h-10 w-full rounded-md border bg-background px-3 text-sm shadow-sm focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                value={mode}
                onChange={(e) => setMode(e.target.value as ChatMode)}
              >
                <option value="tutor">Tutor</option>
                <option value="proof-trainer">Proof Trainer</option>
                <option value="exam">Exam Practice</option>
              </select>
              <div className="mt-2 text-xs text-muted-foreground">
                {mode === "tutor"
                  ? "Tutor Mode: hints + Socratic prompts."
                  : mode === "proof-trainer"
                    ? "Proof Trainer: structure checks + next lemma."
                    : "Exam Practice: generate practice problems by topic/difficulty."}
              </div>
            </div>

            <div className="space-y-1">
              <Label>Rigor</Label>
              <select
                className="h-10 w-full rounded-md border bg-background px-3 text-sm shadow-sm focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                value={rigor}
                onChange={(e) => setRigor(e.target.value as RigorLevel)}
              >
                <option value="intro">Intro</option>
                <option value="intermediate">Intermediate</option>
                <option value="honors">Honors</option>
                <option value="graduate">Graduate</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label>My attempt (optional)</Label>
              <Textarea
                value={attempt}
                onChange={(e) => setAttempt(e.target.value)}
                placeholder="Paste your proof attempt (even partial) for targeted feedback."
                rows={7}
              />
            </div>

            <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
              Hint ladder is integrity-first: start with small hints. Full solutions may require an attempt or Pro.
            </div>
          </div>
        </Card>

        <Card className="flex min-h-[70vh] flex-col overflow-hidden">
          <div className="border-b bg-muted/30 px-5 py-3 text-sm">
            <span className="font-medium">Hint ladder</span>{" "}
            <span className="text-muted-foreground">— choose how much help you want.</span>
          </div>

          <div className="flex-1 space-y-4 overflow-auto p-5">
            {turns.length === 0 ? (
              <div className="rounded-xl border bg-background p-6">
                <div className="text-sm font-medium">Start here</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Type a proof question, then click “Give me a small hint”.
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Tip: paste your attempt to unlock stronger guidance responsibly.
                </div>
              </div>
            ) : null}

            {turns.map((turn) => (
              <div key={turn.id} className="space-y-3">
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground shadow-sm">
                    <div className="text-xs opacity-80">You</div>
                    <div className="mt-1 whitespace-pre-wrap">{turn.question}</div>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl bg-muted/60 px-4 py-3 text-sm shadow-sm">
                    <div className="text-xs text-muted-foreground">Assistant</div>
                    <div className="mt-2">
                      {turn.answer ? (
                        <MathMarkdown content={turn.answer} />
                      ) : (
                        <div className="text-sm text-muted-foreground">…</div>
                      )}
                    </div>

                    {turn.citations.length ? (
                      <div className="mt-4 border-t pt-3 text-xs text-muted-foreground">
                        <div className="font-medium text-foreground">Citations</div>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                          {turn.citations.map((c) => (
                            <li key={c.chunkId}>
                              {c.documentTitle ? `${c.documentTitle}` : "Notes"} {c.section ? `· ${c.section}` : ""}{" "}
                              {typeof c.page === "number" ? `· p.${c.page}` : ""}{" "}
                              {typeof c.similarity === "number" ? `· sim ${c.similarity.toFixed(3)}` : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {turn === lastTurn ? (
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={loading || turn.hintLevel >= 4}
                          onClick={() => runTurn(turn.question, clampHintLevel(turn.hintLevel + 1), turn.id)}
                        >
                          Next rung
                        </Button>
                        <div className="text-xs text-muted-foreground">Current rung: {turn.hintLevel}/4</div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t bg-background p-5">
            <div className="space-y-2">
              <Label htmlFor="prompt">Ask a question</Label>
              <Input
                id="prompt"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., Prove that every Cauchy sequence in ℝ converges."
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button disabled={loading || !input.trim()} onClick={() => runTurn(input.trim(), 1)} title="Give me a small hint">
                <span className="hidden sm:inline">Give me a small hint</span>
                <span className="sm:hidden">Small hint</span>
              </Button>
              <Button
                disabled={loading || !input.trim()}
                variant="secondary"
                onClick={() => runTurn(input.trim(), 2)}
                title="Give me a bigger hint"
              >
                <span className="hidden sm:inline">Give me a bigger hint</span>
                <span className="sm:hidden">Bigger hint</span>
              </Button>
              <Button
                disabled={loading || !input.trim()}
                variant="secondary"
                onClick={() => runTurn(input.trim(), 3)}
                title="Show proof outline"
              >
                <span className="hidden sm:inline">Show proof outline</span>
                <span className="sm:hidden">Outline</span>
              </Button>
              <Button
                disabled={loading || !input.trim()}
                variant="secondary"
                onClick={() => runTurn(input.trim(), 4)}
                title="Show full solution (if allowed)"
              >
                <span className="hidden sm:inline">Show full solution (if allowed)</span>
                <span className="sm:hidden">Full</span>
              </Button>
            </div>

            {error ? (
              <div className="mt-3 rounded-md border bg-muted/40 px-3 py-2 text-sm text-red-700">{error}</div>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
