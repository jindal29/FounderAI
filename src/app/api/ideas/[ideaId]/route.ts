import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const { userId } = await auth();
    const { ideaId } = await params;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const idea = await db.idea.findUnique({
      where: { id: ideaId },
      include: {
        analysisReport: true,
        businessPlan: true,
      },
    });

    if (!idea) {
      return new Response("Not Found", { status: 404 });
    }

    if (idea.userId !== userId) {
      return new Response("Forbidden", { status: 403 });
    }

    return NextResponse.json(idea);
  } catch (error) {
    console.error("GET /api/ideas/[ideaId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const { userId } = await auth();
    const { ideaId } = await params;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const idea = await db.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea) {
      return new Response("Not Found", { status: 404 });
    }

    if (idea.userId !== userId) {
      return new Response("Forbidden", { status: 403 });
    }

    await db.idea.delete({
      where: { id: ideaId },
    });

    return NextResponse.json({ success: true, message: "Idea deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/ideas/[ideaId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
