"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export function MathMarkdown({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none prose-slate prose-headings:mt-4 prose-headings:scroll-mt-20 prose-headings:font-semibold prose-a:text-primary prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:bg-muted/50">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
