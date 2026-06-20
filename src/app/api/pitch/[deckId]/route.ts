import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ deckId: string }> }
) {
  try {
    const { userId } = await auth();
    const { deckId } = await params;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const deck = await db.pitchDeck.findUnique({
      where: { id: deckId },
      include: {
        idea: true,
      },
    });

    if (!deck) {
      return new Response("Not Found", { status: 404 });
    }

    if (deck.userId !== userId) {
      return new Response("Forbidden", { status: 403 });
    }

    return NextResponse.json(deck);
  } catch (error) {
    console.error("GET /api/pitch/[deckId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ deckId: string }> }
) {
  try {
    const { userId } = await auth();
    const { deckId } = await params;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const deck = await db.pitchDeck.findUnique({
      where: { id: deckId },
    });

    if (!deck) {
      return new Response("Not Found", { status: 404 });
    }

    if (deck.userId !== userId) {
      return new Response("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { slides } = body;

    if (!slides) {
      return new Response("Missing slides body", { status: 400 });
    }

    const updatedDeck = await db.pitchDeck.update({
      where: { id: deckId },
      data: {
        slides,
      },
    });

    return NextResponse.json(updatedDeck);
  } catch (error) {
    console.error("PUT /api/pitch/[deckId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ deckId: string }> }
) {
  try {
    const { userId } = await auth();
    const { deckId } = await params;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const deck = await db.pitchDeck.findUnique({
      where: { id: deckId },
    });

    if (!deck) {
      return new Response("Not Found", { status: 404 });
    }

    if (deck.userId !== userId) {
      return new Response("Forbidden", { status: 403 });
    }

    await db.pitchDeck.delete({
      where: { id: deckId },
    });

    return NextResponse.json({ success: true, message: "Pitch deck deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/pitch/[deckId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
