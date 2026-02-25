export type TextChunk = {
  index: number;
  content: string;
};

function normalizeText(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function chunkText(text: string, options?: { maxChars?: number; overlapChars?: number }): TextChunk[] {
  const maxChars = options?.maxChars ?? 4200;
  const overlapChars = options?.overlapChars ?? 400;

  const normalized = normalizeText(text);
  if (!normalized) return [];

  const paragraphs = normalized.split("\n\n");
  const chunks: TextChunk[] = [];
  let current = "";

  function pushChunk() {
    const content = current.trim();
    if (!content) return;
    chunks.push({ index: chunks.length, content });
  }

  for (const p of paragraphs) {
    const paragraph = p.trim();
    if (!paragraph) continue;

    if ((current + "\n\n" + paragraph).length <= maxChars) {
      current = current ? `${current}\n\n${paragraph}` : paragraph;
      continue;
    }

    pushChunk();

    const overlap = current.slice(Math.max(0, current.length - overlapChars));
    current = overlap ? `${overlap}\n\n${paragraph}` : paragraph;
  }

  pushChunk();
  return chunks;
}

