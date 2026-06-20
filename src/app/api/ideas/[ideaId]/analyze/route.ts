import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getAIProvider } from "@/lib/ai/factory";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  const { ideaId } = await params;
  
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const idea = await db.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea) {
      return new Response("Not Found", { status: 404 });
    }

    if (idea.userId !== userId) {
      return new Response("Forbidden", { status: 403 });
    }

    // Update status to ANALYZING
    await db.idea.update({
      where: { id: ideaId },
      data: { status: "ANALYZING" },
    });

    const aiProvider = getAIProvider();

    // Generate both the validation report and business plan in parallel
    const [report, plan] = await Promise.all([
      aiProvider.generateStructuredReport(
        idea.title,
        idea.oneLiner,
        idea.description,
        idea.industry,
        idea.targetAudience
      ),
      aiProvider.generateBusinessPlan(
        idea.title,
        idea.oneLiner,
        idea.description,
        idea.industry,
        idea.targetAudience
      ),
    ]);

    if (!report || !plan) {
      throw new Error("AI Generation failed to return valid schemas.");
    }

    // Save to Database inside a transaction
    const updatedIdea = await db.$transaction(async (tx) => {
      // Upsert report
      await tx.analysisReport.upsert({
        where: { ideaId },
        update: {
          marketScore: report.marketScore,
          swotAnalysis: report.swotAnalysis,
          competitorAnalysis: report.competitorAnalysis,
          targetPersona: report.targetPersona,
          marketSize: report.marketSize,
          risks: report.risks,
          validationSteps: report.validationSteps,
        },
        create: {
          ideaId,
          marketScore: report.marketScore,
          swotAnalysis: report.swotAnalysis,
          competitorAnalysis: report.competitorAnalysis,
          targetPersona: report.targetPersona,
          marketSize: report.marketSize,
          risks: report.risks,
          validationSteps: report.validationSteps,
        },
      });

      // Upsert business plan
      await tx.businessPlan.upsert({
        where: { ideaId },
        update: {
          executiveSummary: plan.executiveSummary,
          problemSolution: plan.problemSolution,
          monetizationModel: plan.monetizationModel,
          marketingStrategy: plan.marketingStrategy,
          financialPlan: plan.financialPlan,
          milestones: plan.milestones,
        },
        create: {
          ideaId,
          executiveSummary: plan.executiveSummary,
          problemSolution: plan.problemSolution,
          monetizationModel: plan.monetizationModel,
          marketingStrategy: plan.marketingStrategy,
          financialPlan: plan.financialPlan,
          milestones: plan.milestones,
        },
      });

      // Mark idea as COMPLETED
      return tx.idea.update({
        where: { id: ideaId },
        data: { status: "COMPLETED" },
        include: {
          analysisReport: true,
          businessPlan: true,
        },
      });
    });

    return NextResponse.json(updatedIdea);
  } catch (error) {
    console.error(`AI analysis pipeline failed for idea ${ideaId}:`, error);

    // Update status to FAILED in case of crash
    try {
      await db.idea.update({
        where: { id: ideaId },
        data: { status: "FAILED" },
      });
    } catch (dbErr) {
      console.error("Failed to mark idea status as FAILED:", dbErr);
    }

    return new Response("AI generation pipeline failed", { status: 500 });
  }
}
