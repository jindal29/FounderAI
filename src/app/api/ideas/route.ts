import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const ideas = await db.idea.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(ideas);
  } catch (error) {
    console.error("GET /api/ideas error:", error);
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
    const { title, oneLiner, description, industry, targetAudience } = body;

    if (!title || !oneLiner || !description || !industry || !targetAudience) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Robust check: Ensure User exists in PostgreSQL (fallback upsert if webhook lagged)
    await db.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: "sync-fallback@example.com", // Will be updated by webhook later
        name: "Temporary User",
      },
    });

    const idea = await db.idea.create({
      data: {
        userId,
        title,
        oneLiner,
        description,
        industry,
        targetAudience,
        status: "DRAFT",
      },
    });

    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error("POST /api/ideas error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
