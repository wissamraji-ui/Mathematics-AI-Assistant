import { NextResponse } from "next/server";
import { z } from "zod";
import { createOpenAIClient, getChatModel, getEmbeddingModel } from "@/lib/openai";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/billing/plan";

export const runtime = "nodejs";

const BodySchema = z.object({
  courseId: z.string().min(1),
  topic: z.string().min(1).max(200).nullish(),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
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
  topic?: string | null;
  difficulty: "easy" | "medium" | "hard";
  retrieved: RetrievedChunk[];
}) {
  const retrievedContext = input.retrieved.length
    ? input.retrieved
        .map((c, idx) => {
          const title = c.document_title ? ` (${c.document_title})` : "";
          return `[#${idx + 1}]${title}\n${c.content_text}`;
        })
        .join("\n\n")
    : "(no relevant notes retrieved)";

  return [
    "You generate ONE exam-practice mathematics problem for a proof-oriented course.",
    "The goal is learning. Do not include a worked solution, proof outline, or hints.",
    "Prefer the course notes context (definitions/theorems/notation) when relevant.",
    "",
    `Course: ${input.courseId}`,
    `Difficulty: ${input.difficulty}`,
    input.topic ? `Topic: ${input.topic}` : "Topic: (any core topic)",
    "",
    "Retrieved course notes (use for alignment, may be incomplete):",
    retrievedContext,
    "",
    "Output format (strict):",
    "## Problem",
    "(problem statement in 5–15 lines; can be multi-part; use LaTeX)",
    "",
    "## What to submit",
    "(1–3 bullet points; e.g., 'Provide a proof...')",
  ].join("\n");
}

function extractProblem(markdown: string) {
  const text = (markdown || "").trim();
  if (!text) return "";
  const idx = text.indexOf("## Problem");
  if (idx >= 0) return text.slice(idx).trim();
  return text;
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
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = BodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });

  const plan = await getUserPlan(user.id);
  if (plan === "free") {
    return NextResponse.json(
      {
        error: "Exam Practice is available on the Student or Pro plan.",
      },
      { status: 402 },
    );
  }

  const body = parsed.data;
  const openai = createOpenAIClient();
  const service = createSupabaseServiceClient();

  const query = body.topic ? `${body.courseId}: ${body.topic}` : `${body.courseId}: core topics`;
  const emb = await openai.embeddings.create({ model: getEmbeddingModel(), input: query });
  const embedding = emb.data[0]?.embedding;
  const retrieved = embedding ? await retrieveChunks({ service, courseId: body.courseId, embedding }) : [];

  const system = buildSystemPrompt({
    courseId: body.courseId,
    topic: body.topic,
    difficulty: body.difficulty,
    retrieved,
  });

  const completion = await openai.chat.completions.create({
    model: getChatModel(),
    messages: [{ role: "system", content: system }],
    temperature: 0.8,
  });

  const raw = completion.choices[0]?.message?.content || "";
  const problem = extractProblem(raw);

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

  return NextResponse.json({ problem, citations });
}

