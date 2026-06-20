import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ canvasId: string }> }
) {
  try {
    const { userId } = await auth();
    const { canvasId } = await params;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const canvas = await db.businessModelCanvas.findUnique({
      where: { id: canvasId },
      include: { idea: true },
    });

    if (!canvas) {
      return new Response("Not Found", { status: 404 });
    }

    if (canvas.userId !== userId) {
      return new Response("Forbidden", { status: 403 });
    }

    return NextResponse.json(canvas);
  } catch (error) {
    console.error("GET /api/canvas/[canvasId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ canvasId: string }> }
) {
  try {
    const { userId } = await auth();
    const { canvasId } = await params;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const canvas = await db.businessModelCanvas.findUnique({
      where: { id: canvasId },
    });

    if (!canvas) {
      return new Response("Not Found", { status: 404 });
    }

    if (canvas.userId !== userId) {
      return new Response("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { 
      keyPartners, 
      keyActivities, 
      keyResources, 
      valuePropositions, 
      customerRelationships, 
      channels, 
      customerSegments, 
      costStructure, 
      revenueStreams 
    } = body;

    const updatedCanvas = await db.businessModelCanvas.update({
      where: { id: canvasId },
      data: {
        keyPartners: keyPartners || undefined,
        keyActivities: keyActivities || undefined,
        keyResources: keyResources || undefined,
        valuePropositions: valuePropositions || undefined,
        customerRelationships: customerRelationships || undefined,
        channels: channels || undefined,
        customerSegments: customerSegments || undefined,
        costStructure: costStructure || undefined,
        revenueStreams: revenueStreams || undefined,
      },
    });

    return NextResponse.json(updatedCanvas);
  } catch (error) {
    console.error("PUT /api/canvas/[canvasId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ canvasId: string }> }
) {
  try {
    const { userId } = await auth();
    const { canvasId } = await params;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const canvas = await db.businessModelCanvas.findUnique({
      where: { id: canvasId },
    });

    if (!canvas) {
      return new Response("Not Found", { status: 404 });
    }

    if (canvas.userId !== userId) {
      return new Response("Forbidden", { status: 403 });
    }

    await db.businessModelCanvas.delete({
      where: { id: canvasId },
    });

    return NextResponse.json({ success: true, message: "Canvas deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/canvas/[canvasId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
