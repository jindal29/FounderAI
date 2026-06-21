import { checkDatabaseConnection } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const dbStatus = await checkDatabaseConnection();
  
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes("dummy");
  const hasGeminiKey = !!process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes("dummy");

  return NextResponse.json({
    status: dbStatus.ok ? "healthy" : "unhealthy",
    database: {
      connected: dbStatus.ok,
      error: dbStatus.error || null,
    },
    ai: {
      openai: hasOpenAIKey ? "configured" : "missing",
      gemini: hasGeminiKey ? "configured" : "missing",
    }
  }, {
    status: dbStatus.ok ? 200 : 503
  });
}

export const dynamic = "force-dynamic";
