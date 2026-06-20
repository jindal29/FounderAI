import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getAIProvider } from "@/lib/ai/factory";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const canvases = await db.businessModelCanvas.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        idea: true,
      },
    });

    return NextResponse.json(canvases);
  } catch (error) {
    console.error("GET /api/canvas error:", error);
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
    const { title, description, industry, ideaId } = body;

    if (!title || !description || !industry) {
      return new Response("Missing required fields (title, description, industry)", { status: 400 });
    }

    // Ensure User profile exists in db (upsert fallback if webhook lagged)
    await db.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: "sync-fallback@example.com",
        name: "Temporary User",
      },
    });

    // Run business model canvas pipeline using dynamic provider
    const aiProvider = getAIProvider();
    const canvasData = await aiProvider.generateBusinessModelCanvas(title, description, industry);

    if (!canvasData) {
      throw new Error("AI Generation failed to return valid canvas data.");
    }

    // Store in PostgreSQL
    const canvas = await db.businessModelCanvas.create({
      data: {
        userId,
        ideaId: ideaId || null,
        title,
        description,
        keyPartners: canvasData.keyPartners,
        keyActivities: canvasData.keyActivities,
        keyResources: canvasData.keyResources,
        valuePropositions: canvasData.valuePropositions,
        customerRelationships: canvasData.customerRelationships,
        channels: canvasData.channels,
        customerSegments: canvasData.customerSegments,
        costStructure: canvasData.costStructure,
        revenueStreams: canvasData.revenueStreams,
      },
      include: {
        idea: true,
      },
    });

    return NextResponse.json(canvas, { status: 201 });
  } catch (error) {
    console.error("POST /api/canvas error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const maxDuration = 30;
