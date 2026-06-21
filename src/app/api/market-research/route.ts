import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { NextResponse } from "next/server";

const TrendSchema = z.object({
  trend: z.string(),
  impact: z.enum(["High", "Medium", "Low"]),
  detail: z.string(),
});

const TrendsOutputSchema = z.object({
  trends: z.array(TrendSchema),
});

type TrendsOutput = z.infer<typeof TrendsOutputSchema>;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { query, industry } = await req.json();
    if (!query && !industry) {
      return new Response("Missing search query or industry", { status: 400 });
    }

    const searchQuery = query || `Latest market trends in ${industry}`;
    const provider = process.env.AI_PROVIDER || "openai";

    const isGeminiKeyDummy = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("dummy") || process.env.GEMINI_API_KEY.includes("AIzaSy...");
    const isOpenAIKeyDummy = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes("dummy") || process.env.OPENAI_API_KEY.includes("sk-proj-...");

    let result: TrendsOutput;

    if (provider.toLowerCase() === "gemini") {
      if (isGeminiKeyDummy) {
        result = getMockTrends(searchQuery);
      } else {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `
          Perform live market research and scan recent industry trends for the following query.
          Query/Topic: ${searchQuery}
          
          Identify 3 critical, cutting-edge market trends. For each trend, specify its title, impact level (High, Medium, Low), and a detailed explanation of why it is relevant today and how it represents an opportunity or threat.
        `;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            systemInstruction: "You are a top-tier industry analyst. Use live search grounding to output modern, up-to-date market trends in structured JSON.",
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                trends: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      trend: { type: "STRING" },
                      impact: { type: "STRING", enum: ["High", "Medium", "Low"] },
                      detail: { type: "STRING" }
                    },
                    required: ["trend", "impact", "detail"]
                  }
                }
              },
              required: ["trends"]
            }
          }
        });
        
        result = JSON.parse(response.text || "{}") as TrendsOutput;
      }
    } else {
      // OpenAI
      if (isOpenAIKeyDummy) {
        result = getMockTrends(searchQuery);
      } else {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const prompt = `
          Analyze current market trends and provide industry insights based on the query: "${searchQuery}".
          Return exactly 3 key trends. Specify their title, impact (High, Medium, Low), and details.
        `;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are an expert market strategist returning structured JSON analysis." },
            { role: "user", content: prompt }
          ],
          response_format: zodResponseFormat(TrendsOutputSchema, "market_trends")
        });

        result = JSON.parse(completion.choices[0].message.content || "{}") as TrendsOutput;
      }
    }

    if (!result || !result.trends || result.trends.length === 0) {
      result = getMockTrends(searchQuery);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/market-research error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

function getMockTrends(query: string): TrendsOutput {
  return {
    trends: [
      {
        trend: `AI-Powered Automation in ${query}`,
        impact: "High",
        detail: "Organizations are rapidly deploying localized LLM agents to automate complex workflows and operations, reducing turnaround times from days to minutes."
      },
      {
        trend: "Decentralized & Edge Processing",
        impact: "Medium",
        detail: "To combat rising API costs and latency issues, enterprise players are migrating inference to edge servers and lightweight client machines."
      },
      {
        trend: "Hyper-Personalization Frameworks",
        impact: "High",
        detail: "Static interfaces are giving way to dynamic UI environments that adapt in real time to individual user profiles, search histories, and behavior loops."
      }
    ]
  };
}

export const dynamic = "force-dynamic";
export const maxDuration = 30;
