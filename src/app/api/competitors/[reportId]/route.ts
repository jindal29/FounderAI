import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const { userId } = await auth();
    const { reportId } = await params;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const report = await db.competitorReport.findUnique({
      where: { id: reportId },
      include: {
        idea: true,
      },
    });

    if (!report) {
      return new Response("Not Found", { status: 404 });
    }

    if (report.userId !== userId) {
      return new Response("Forbidden", { status: 403 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("GET /api/competitors/[reportId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const { userId } = await auth();
    const { reportId } = await params;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const report = await db.competitorReport.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return new Response("Not Found", { status: 404 });
    }

    if (report.userId !== userId) {
      return new Response("Forbidden", { status: 403 });
    }

    await db.competitorReport.delete({
      where: { id: reportId },
    });

    return NextResponse.json({ success: true, message: "Competitor report deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/competitors/[reportId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
