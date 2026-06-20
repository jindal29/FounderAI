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

    const decks = await db.pitchDeck.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        idea: true,
      },
    });

    return NextResponse.json(decks);
  } catch (error) {
    console.error("GET /api/pitch error:", error);
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

    // Run Pitch Deck pipeline using dynamic provider
    const aiProvider = getAIProvider();
    const deckData = await aiProvider.generatePitchDeck(title, description, industry);

    if (!deckData || !deckData.slides) {
      throw new Error("AI Generation failed to return valid pitch deck data.");
    }

    // Store in PostgreSQL
    const deck = await db.pitchDeck.create({
      data: {
        userId,
        ideaId: ideaId || null,
        title,
        description,
        slides: deckData.slides,
      },
      include: {
        idea: true,
      },
    });

    return NextResponse.json(deck, { status: 201 });
  } catch (error) {
    console.error("POST /api/pitch error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const maxDuration = 30;
