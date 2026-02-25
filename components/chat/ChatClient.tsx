"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MathMarkdown } from "@/components/math/MathMarkdown";

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
    <div className="container py-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-80">
          <Card className="p-5">
            <div className="text-sm font-medium">Session</div>
            <div className="mt-4 space-y-4">
              <div className="space-y-1">
                <Label>Course</Label>
                <select
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  <option value="real-analysis-1">Real Analysis I</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label>Mode</Label>
                <select
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
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
                      ? "Proof Trainer: checks proof structure and suggests the next lemma/step."
                      : "Exam Practice: generate practice problems by topic/difficulty and get hint-based help."}
                </div>
              </div>

              <div className="space-y-1">
                <Label>Rigor</Label>
                <select
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
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
                  placeholder="Write your proof attempt or partial work to unlock better guidance."
                  rows={6}
                />
              </div>

              <div className="rounded-lg border border-border bg-muted p-3 text-xs text-muted-foreground">
                Hint ladder is integrity-first: you’ll start with small hints. Full solutions may require a written
                attempt or a higher tier.
              </div>
            </div>
          </Card>
        </div>

        <div className="flex-1 space-y-4">
          <Card className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1">
                <Label htmlFor="prompt">Ask a question</Label>
                <Input
                  id="prompt"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g., Prove that every Cauchy sequence in ℝ converges."
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-6 sm:pt-0">
                <Button
                  disabled={loading || !input.trim()}
                  onClick={() => runTurn(input.trim(), 1)}
                  title="Give me a small hint"
                >
                  Give me a small hint
                </Button>
                <Button
                  disabled={loading || !input.trim()}
                  variant="secondary"
                  onClick={() => runTurn(input.trim(), 2)}
                  title="Give me a bigger hint"
                >
                  Give me a bigger hint
                </Button>
                <Button
                  disabled={loading || !input.trim()}
                  variant="secondary"
                  onClick={() => runTurn(input.trim(), 3)}
                  title="Show proof outline"
                >
                  Show proof outline
                </Button>
                <Button
                  disabled={loading || !input.trim()}
                  variant="secondary"
                  onClick={() => runTurn(input.trim(), 4)}
                  title="Show full solution (if allowed)"
                >
                  Show full solution (if allowed)
                </Button>
              </div>
            </div>

            {error ? <div className="mt-4 rounded-md border border-border bg-muted px-3 py-2 text-sm text-red-700">{error}</div> : null}
          </Card>

          <div className="space-y-4">
            {turns.length === 0 ? (
              <Card className="p-8">
                <div className="text-sm text-muted-foreground">
                  Ask a proof question to begin. Use the hint buttons to control how much help you get.
                </div>
              </Card>
            ) : null}

            {turns.map((turn) => (
              <Card key={turn.id} className="p-5">
                <div className="text-sm text-muted-foreground">You</div>
                <div className="mt-1 text-sm">{turn.question}</div>

                <div className="mt-5 text-sm text-muted-foreground">Assistant</div>
                <div className="mt-2">
                  {turn.answer ? <MathMarkdown content={turn.answer} /> : <div className="text-sm text-muted-foreground">…</div>}
                </div>

                {turn.citations.length ? (
                  <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
                    <div className="font-medium text-foreground">Citations</div>
                    <ul className="mt-2 space-y-1">
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
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={loading || turn.hintLevel >= 4}
                      onClick={() => runTurn(turn.question, clampHintLevel(turn.hintLevel + 1), turn.id)}
                    >
                      Next rung
                    </Button>
                    <div className="text-xs text-muted-foreground self-center">Current rung: {turn.hintLevel}/4</div>
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
