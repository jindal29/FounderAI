import { AIProvider } from "./types";
import { OpenAIProvider } from "./openai-provider";
import { GeminiProvider } from "./gemini-provider";

export function getAIProvider(): AIProvider {
  const providerType = process.env.AI_PROVIDER || "openai";

  if (providerType.toLowerCase() === "gemini") {
    return new GeminiProvider();
  }

  return new OpenAIProvider();
}
