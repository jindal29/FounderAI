import { auth } from "@clerk/nextjs/server";
import { getAIProvider } from "@/lib/ai/factory";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { description, industry } = await req.json();
    if (!description || !industry) {
      return new Response("Description and industry are required", { status: 400 });
    }

    const nameSuggestions = await getAIProvider().generateStartupNames(description, industry);
    return NextResponse.json(nameSuggestions);
  } catch (error) {
    console.error("POST /api/suggestions/names error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
export const dynamic = "force-dynamic";
export const maxDuration = 30;
