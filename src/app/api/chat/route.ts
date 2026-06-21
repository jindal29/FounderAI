import { geminiStreamChat } from "@/lib/gemini";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages, sessionId, ideaId } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Messages array is required", { status: 400 });
    }

    const latestMessage = messages[messages.length - 1].content;
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "user" ? ("user" as const) : ("model" as const),
      text: m.content,
    }));

    // Fetch startup idea context if provided
    let ideaContext: { title: string; description: string; marketAnalysis?: string } = { title: "General", description: "General startup brainstorming" };
    if (ideaId) {
      const idea = await db.idea.findUnique({
        where: { id: ideaId },
        include: { analysisReport: true },
      });
      if (idea && idea.userId === userId) {
        ideaContext = {
          title: idea.title,
          description: idea.description,
          marketAnalysis: idea.analysisReport
            ? JSON.stringify(idea.analysisReport.swotAnalysis)
            : undefined,
        };
      }
    }

    const isGeminiKeyDummy = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("dummy") || process.env.GEMINI_API_KEY.includes("AIzaSy...") || process.env.GEMINI_API_KEY === "";

    if (isGeminiKeyDummy) {
      const mockReplies = [
        `That's a very interesting angle for ${ideaContext.title}! Let's talk about the monetization strategy. Have you considered offering a self-serve Freemium tier alongside a Pro tier for advanced features? This lowers the barrier to entry while capturing high-value professional clients. What do you think about setting the pricing structure?`,
        `Analyzing the customer segments for ${ideaContext.title}, the primary persona would definitely be early-stage tech teams. They need automation to reclaim time but have limited budgets. To validate this willingness to pay, we should build a single-page interactive sandbox and measure signup conversion. Do you have a specific launch timeline in mind?`,
        `For the competitor landscape of ${ideaContext.title}, your key differentiator is workflow fluidness and search grounding integration. Legacy platforms are slow and expensive, requiring weeks of manual setup. By offering self-serve onboarding, you disrupt their pricing model instantly. Let's outline the core features of your Phase 1 MVP!`
      ];
      
      let replyText = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      if (latestMessage.toLowerCase().includes("risk")) {
        replyText = `The biggest execution risk for ${ideaContext.title} is technical integration complexity and user onboarding friction. If users experience delay during their first scan, they will drop off. We can mitigate this by building instant, high-fidelity mock analysis screens and keeping Clerk auth paths simple. What other risks are on your radar?`;
      } else if (latestMessage.toLowerCase().includes("pricing") || latestMessage.toLowerCase().includes("monetiz")) {
        replyText = `For ${ideaContext.title}, a tiered SaaS subscription fits best. Tier 1: Free concept drafting. Tier 2: Pro at $19/month for full AI engines, search scans, and PDF downloads. Tier 3: Enterprise custom setups for VC groups and incubators. How does that pricing structure align with your customer acquisition cost estimates?`;
      }

      if (sessionId) {
        await db.chatMessage.create({
          data: {
            sessionId,
            role: "USER",
            content: latestMessage,
          },
        });
      }

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const words = replyText.split(" ");
          let fullText = "";
          for (const word of words) {
            const chunkText = word + " ";
            fullText += chunkText;
            controller.enqueue(encoder.encode(chunkText));
            await new Promise((resolve) => setTimeout(resolve, 50));
          }

          if (sessionId) {
            await db.chatMessage.create({
              data: {
                sessionId,
                role: "ASSISTANT",
                content: fullText.trim(),
              },
            });
          }
          controller.close();
        }
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // Call Gemini streaming API
    const responseStream = await geminiStreamChat(history, latestMessage, ideaContext);

    // Save user message to database in the background if sessionId exists
    if (sessionId) {
      await db.chatMessage.create({
        data: {
          sessionId,
          role: "USER",
          content: latestMessage,
        },
      });
    }

    // Create a ReadableStream to stream the response back
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponseText = "";
        
        try {
          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              fullResponseText += text;
              controller.enqueue(encoder.encode(text));
            }
          }

          // Save assistant message to database in the background if sessionId exists
          if (sessionId && fullResponseText) {
            await db.chatMessage.create({
              data: {
                sessionId,
                role: "ASSISTANT",
                content: fullResponseText,
              },
            });
          }
        } catch (err) {
          console.error("Streaming error:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("POST /api/chat error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
export const dynamic = "force-dynamic";
export const maxDuration = 60; // Max execution timeout for Vercel
