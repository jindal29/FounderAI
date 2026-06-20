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
