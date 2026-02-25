import { NextResponse } from "next/server";
import { z } from "zod";
import { createOpenAIClient, getEmbeddingModel } from "@/lib/openai";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const RetrieveSchema = z.object({
  query: z.string().min(1).max(20_000),
  courseId: z.string().min(1),
});

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = RetrieveSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }

  const openai = createOpenAIClient();
  const emb = await openai.embeddings.create({ model: getEmbeddingModel(), input: parsed.data.query });
  const embedding = emb.data[0]?.embedding;
  if (!embedding) return NextResponse.json({ chunks: [] });

  const service = createSupabaseServiceClient();
  const { data } = await service.rpc("match_chunks", {
    query_embedding: embedding,
    match_count: 8,
    course_id: parsed.data.courseId,
  });

  return NextResponse.json({ chunks: data || [] });
}
