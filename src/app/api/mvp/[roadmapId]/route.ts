import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ roadmapId: string }> }
) {
  try {
    const { userId } = await auth();
    const { roadmapId } = await params;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const roadmap = await db.mvpRoadmap.findUnique({
      where: { id: roadmapId },
      include: {
        idea: true,
      },
    });

    if (!roadmap) {
      return new Response("Not Found", { status: 404 });
    }

    if (roadmap.userId !== userId) {
      return new Response("Forbidden", { status: 403 });
    }

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error("GET /api/mvp/[roadmapId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ roadmapId: string }> }
) {
  try {
    const { userId } = await auth();
    const { roadmapId } = await params;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const roadmap = await db.mvpRoadmap.findUnique({
      where: { id: roadmapId },
    });

    if (!roadmap) {
      return new Response("Not Found", { status: 404 });
    }

    if (roadmap.userId !== userId) {
      return new Response("Forbidden", { status: 403 });
    }

    await db.mvpRoadmap.delete({
      where: { id: roadmapId },
    });

    return NextResponse.json({ success: true, message: "MVP roadmap deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/mvp/[roadmapId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
