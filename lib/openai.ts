import OpenAI from "openai";
import { getRequiredEnv } from "@/lib/env";

export function createOpenAIClient() {
  return new OpenAI({ apiKey: getRequiredEnv("OPENAI_API_KEY") });
}

export function getChatModel() {
  return process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
}

export function getEmbeddingModel() {
  return process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
}

