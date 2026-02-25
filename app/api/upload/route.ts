import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { z } from "zod";
import { createOpenAIClient, getEmbeddingModel } from "@/lib/openai";
import { chunkText } from "@/lib/rag/chunking";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const UploadFieldsSchema = z.object({
  title: z.string().min(1).max(200),
  courseId: z.string().min(1).max(100),
});

async function ensureAdmin(service: ReturnType<typeof createSupabaseServiceClient>, userId: string) {
  const { data } = await service.from("users").select("role").eq("id", userId).maybeSingle();
  return data?.role === "admin";
}

async function extractTextFromFile(file: File): Promise<{ text: string; kind: "pdf" | "text" }> {
  const filename = file.name.toLowerCase();
  const type = file.type?.toLowerCase();

  const buffer = Buffer.from(await file.arrayBuffer());
  const looksPdf = type === "application/pdf" || filename.endsWith(".pdf");

  if (looksPdf) {
    const parsed = await pdfParse(buffer);
    return { text: parsed.text || "", kind: "pdf" };
  }

  const text = buffer.toString("utf-8");
  return { text, kind: "text" };
}

async function embedAll(openai: ReturnType<typeof createOpenAIClient>, texts: string[]) {
  if (!texts.length) return [];
  const model = getEmbeddingModel();

  const batchSize = 96;
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const res = await openai.embeddings.create({ model, input: batch });
    for (const row of res.data) embeddings.push(row.embedding);
  }

  return embeddings;
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const title = formData.get("title");
  const courseId = formData.get("courseId");
  const file = formData.get("file");

  const parsed = UploadFieldsSchema.safeParse({ title, courseId });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid fields", details: parsed.error.flatten() }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const service = createSupabaseServiceClient();
  const ok = await ensureAdmin(service, user.id);
  if (!ok) return NextResponse.json({ error: "Admin access required" }, { status: 403 });

  const openai = createOpenAIClient();
  const extracted = await extractTextFromFile(file);
  const chunks = chunkText(extracted.text);

  if (!chunks.length) {
    return NextResponse.json({ error: "No text extracted from file" }, { status: 400 });
  }

  const { data: doc, error: docError } = await service
    .from("documents")
    .insert({
      title: parsed.data.title,
      course_id: parsed.data.courseId,
      uploaded_by: user.id,
      storage_path: "",
    })
    .select("id")
    .single();

  if (docError || !doc?.id) {
    return NextResponse.json({ error: "Failed to create document record", details: docError?.message }, { status: 500 });
  }

  const storagePath = `${parsed.data.courseId}/${doc.id}/${file.name}`;
  const fileBlob = new Blob([Buffer.from(await file.arrayBuffer())], {
    type: file.type || "application/octet-stream",
  });
  const uploadRes = await service.storage.from("documents").upload(storagePath, fileBlob, {
    contentType: file.type || undefined,
    upsert: true,
  });

  if (uploadRes.error) {
    return NextResponse.json({ error: "Failed to upload to storage", details: uploadRes.error.message }, { status: 500 });
  }

  await service.from("documents").update({ storage_path: storagePath }).eq("id", doc.id);

  const embeddings = await embedAll(openai, chunks.map((c) => c.content));

  const rows = chunks.map((c, idx) => ({
    document_id: doc.id,
    chunk_index: c.index,
    content_text: c.content,
    embedding: embeddings[idx],
    metadata: {
      source: extracted.kind,
    },
  }));

  const { error: insertError } = await service.from("chunks").insert(rows);
  if (insertError) {
    return NextResponse.json({ error: "Failed to insert chunks", details: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, documentId: doc.id, chunks: rows.length });
}
