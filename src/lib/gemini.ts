import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "dummy_gemini_key_for_nextjs_build";

export const ai = new GoogleGenAI({ apiKey });

export interface ChatMessageParam {
  role: "user" | "model";
  text: string;
}

export async function geminiStreamChat(
  history: ChatMessageParam[],
  latestMessage: string,
  context: { title: string; description: string; marketAnalysis?: string }
) {
  const systemInstruction = `
    You are an AI Startup Co-Founder named FounderAI. 
    Your goal is to guide the user (an entrepreneur) through building their startup, refining their business plan, validating assumptions, and answering questions.
    
    You must be highly encouraging yet brutally honest about market realities. Use data-driven reasoning.
    
    Startup Context:
    - Name: ${context.title}
    - Description: ${context.description}
    ${context.marketAnalysis ? `- Additional Market Analysis: ${context.marketAnalysis}` : ""}
    
    Converse with the user based on this context. 
  `;

  // Map history to the structure required by Gemini
  const contents = [
    ...history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
    {
      role: "user",
      parts: [{ text: latestMessage }],
    },
  ];

  return ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents,
    config: {
      systemInstruction,
    },
  });
}
