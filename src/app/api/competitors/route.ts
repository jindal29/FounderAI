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

    const reports = await db.competitorReport.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        idea: true,
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("GET /api/competitors error:", error);
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

    // Run competitor analysis pipeline using dynamic provider
    const aiProvider = getAIProvider();
    const reportData = await aiProvider.generateCompetitorReport(title, description, industry);

    if (!reportData || !reportData.competitors) {
      throw new Error("AI Generation failed to return valid competitor schema.");
    }

    // Store in PostgreSQL
    const competitorReport = await db.competitorReport.create({
      data: {
        userId,
        ideaId: ideaId || null,
        title,
        description,
        industry,
        competitors: reportData.competitors,
      },
      include: {
        idea: true,
      },
    });

    return NextResponse.json(competitorReport, { status: 201 });
  } catch (error) {
    console.error("POST /api/competitors error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const maxDuration = 30;
