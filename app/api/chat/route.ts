import { NextResponse } from "next/server";
import { z } from "zod";
import { createOpenAIClient, getChatModel, getEmbeddingModel } from "@/lib/openai";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import { evaluateHintPolicy } from "@/lib/policy";
import { getUserPlan } from "@/lib/billing/plan";

export const runtime = "nodejs";

const ChatRequestSchema = z.object({
  message: z.string().min(1).max(20_000),
  courseId: z.string().min(1),
  mode: z.enum(["tutor", "proof-trainer", "exam"]).default("tutor"),
  rigor: z.enum(["intro", "intermediate", "honors", "graduate"]).default("intermediate"),
  hintLevel: z.number().int().min(1).max(4).default(1),
  attempt: z.string().nullish(),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(20_000) }))
    .max(20)
    .optional()
    .default([]),
});

type RetrievedChunk = {
  id: string;
  content_text: string;
  document_title?: string | null;
  metadata?: Record<string, unknown> | null;
  similarity?: number | null;
};

function buildSystemPrompt(input: {
  courseId: string;
  mode: "tutor" | "proof-trainer" | "exam";
  rigor: "intro" | "intermediate" | "honors" | "graduate";
  hintLevel: 1 | 2 | 3 | 4;
  policyNotice?: string;
  retrieved: RetrievedChunk[];
}) {
  const rigorRule =
    input.rigor === "intro"
      ? "Use gentle explanations and simple proof structure."
      : input.rigor === "intermediate"
        ? "Be rigorous, but keep steps short and instructive."
        : input.rigor === "honors"
          ? "Be concise, theorem/lemma oriented, and careful about quantifiers."
          : "Assume graduate-level maturity; use precise definitions and proof techniques.";

  const ladderRule =
    input.hintLevel === 1
      ? "Output only: ## Idea, ## Hint 1."
      : input.hintLevel === 2
        ? "Output only: ## Idea, ## Hint 1, ## Hint 2."
        : input.hintLevel === 3
          ? "Output only: ## Idea, ## Hint 1, ## Hint 2, ## Proof outline."
          : "Output: ## Idea, ## Hint 1, ## Hint 2, ## Proof outline, ## Full solution.";

  const modeRule =
    input.mode === "tutor"
      ? [
          "Tutor Mode rules:",
          "- Use Socratic prompts: ask 1–2 short questions that help the student choose the next step.",
          "- Prefer gentle hints and checkpoints over long exposition.",
        ].join("\n")
      : input.mode === "proof-trainer"
        ? [
            "Proof Trainer rules:",
            "- Focus on proof structure, missing justifications, and the next useful lemma/step.",
            "- If the user provides an attempt, reference it and suggest targeted repairs.",
            "- Do NOT rewrite a full polished proof unless the hint ladder allows it.",
          ].join("\n")
        : [
            "Exam Practice rules:",
            "- If asked to generate a practice problem, produce a fresh problem statement aligned to the course topic/difficulty.",
            "- If asked to solve a problem, stick to the hint ladder and avoid solution dumping.",
          ].join("\n");

  const retrievedContext = input.retrieved.length
    ? input.retrieved
        .map((c, idx) => {
          const title = c.document_title ? ` (${c.document_title})` : "";
          return `[#${idx + 1}]${title}\n${c.content_text}`;
        })
        .join("\n\n")
    : "(no relevant notes retrieved)";

  return [
    "You are a proof-oriented mathematics tutor. Your mission is to help the student learn, not to help them cheat.",
    "",
    `Course: ${input.courseId}`,
    `Mode: ${input.mode}`,
    `Rigor: ${input.rigor}. ${rigorRule}`,
    modeRule,
    "",
    "Academic integrity rules:",
    "- Default to hints and questions before giving solutions.",
    "- If the user indicates they are in an active graded/timed assessment, refuse full solutions and offer conceptual help and small hints.",
    "- Never provide answer-dumping; prioritize definitions, theorem statements, and proof structure.",
    "",
    "Hint ladder rules (very important):",
    `- Requested rung: ${input.hintLevel}/4. ${ladderRule}`,
    "- Do NOT include sections beyond the allowed rung.",
    "",
    input.policyNotice ? `Policy notice to the user: ${input.policyNotice}` : "",
    "",
    "Retrieved course notes (may be incomplete). Prefer these when relevant:",
    retrievedContext,
    "",
    "Output format:",
    "- Use Markdown headings exactly: ## Idea, ## Hint 1, ## Hint 2, ## Proof outline, ## Full solution",
    "- Use LaTeX for math when appropriate (e.g., $\\varepsilon$, $\\forall$).",
  ]
    .filter(Boolean)
    .join("\n");
}

function stripDisallowedSections(answer: string, hintLevel: 1 | 2 | 3 | 4) {
  const headings = ["## Idea", "## Hint 1", "## Hint 2", "## Proof outline", "## Full solution"] as const;
  const allowedUpTo = hintLevel === 1 ? "## Hint 1" : hintLevel === 2 ? "## Hint 2" : hintLevel === 3 ? "## Proof outline" : "## Full solution";
  const allowedIndex = headings.indexOf(allowedUpTo);
  const disallowed = headings.slice(allowedIndex + 1);
  const indices = disallowed
    .map((h) => answer.indexOf(h))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b);
  if (!indices.length) return answer.trim();
  return answer.slice(0, indices[0]).trim();
}

async function retrieveChunks(input: { service: ReturnType<typeof createSupabaseServiceClient>; courseId: string; embedding: number[] }) {
  const { data, error } = await input.service.rpc("match_chunks", {
    query_embedding: input.embedding,
    match_count: 6,
    course_id: input.courseId,
  });

  if (error || !Array.isArray(data)) return [];
  return data as RetrievedChunk[];
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = ChatRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }

  const body = parsed.data;
  const service = createSupabaseServiceClient();
  const plan = await getUserPlan(user.id);
  const policy = evaluateHintPolicy({
    requestedHintLevel: body.hintLevel,
    plan,
    attempt: body.attempt,
    message: body.message,
  });

  const openai = createOpenAIClient();

  const embeddingRes = await openai.embeddings.create({
    model: getEmbeddingModel(),
    input: body.message,
  });

  const embedding = embeddingRes.data[0]?.embedding;
  const retrieved = embedding ? await retrieveChunks({ service, courseId: body.courseId, embedding }) : [];

  const system = buildSystemPrompt({
    courseId: body.courseId,
    mode: body.mode,
    rigor: body.rigor,
    hintLevel: policy.effectiveHintLevel,
    policyNotice: policy.policyNotice,
    retrieved,
  });

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: system },
    ...body.history.map((m) => ({ role: m.role, content: m.content })),
    {
      role: "user",
      content: [
        body.message,
        body.attempt?.trim() ? `\n\nMy attempt:\n${body.attempt.trim()}` : "",
        body.mode === "proof-trainer" ? "\n\nPlease focus on proof structure and the next best step." : "",
      ]
        .filter(Boolean)
        .join(""),
    },
  ];

  const completion = await openai.chat.completions.create({
    model: getChatModel(),
    messages,
    temperature: body.mode === "exam" ? 0.7 : 0.3,
  });

  const rawAnswer = completion.choices[0]?.message?.content || "";
  const answer = stripDisallowedSections(rawAnswer, policy.effectiveHintLevel);

  const citations = retrieved.map((c) => {
    const meta = (c.metadata || {}) as Record<string, unknown>;
    return {
      chunkId: c.id,
      documentTitle: c.document_title ?? undefined,
      section: typeof meta.section === "string" ? meta.section : undefined,
      page: typeof meta.page === "number" ? meta.page : undefined,
      similarity: typeof c.similarity === "number" ? c.similarity : undefined,
    };
  });

  return NextResponse.json({ answer, citations });
}
