import { auth } from "@clerk/nextjs/server";
import { getAIProvider } from "@/lib/ai/factory";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { title, description, industry } = await req.json();
    if (!title || !description || !industry) {
      return new Response("Title, description, and industry are required", { status: 400 });
    }

    const suggestions = await getAIProvider().generateBusinessSuggestions(title, description, industry);
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("POST /api/suggestions/business error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
export const dynamic = "force-dynamic";
export const maxDuration = 30;
