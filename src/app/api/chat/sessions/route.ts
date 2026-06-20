import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (sessionId) {
      const session = await db.chatSession.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!session) {
        return new Response("Not Found", { status: 404 });
      }

      if (session.userId !== userId) {
        return new Response("Forbidden", { status: 403 });
      }

      return NextResponse.json(session);
    }

    const sessions = await db.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("GET /api/chat/sessions error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title } = body;

    if (!title) {
      return new Response("Title is required", { status: 400 });
    }

    const session = await db.chatSession.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("POST /api/chat/sessions error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
