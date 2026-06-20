import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const dbUser = await db.user.findUnique({
      where: { id: userId },
      select: {
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripePriceId: true,
        stripeCurrentPeriodEnd: true,
      },
    });

    const isPro = !!(
      dbUser?.stripePriceId &&
      dbUser?.stripeCurrentPeriodEnd &&
      new Date(dbUser.stripeCurrentPeriodEnd) > new Date()
    );

    return NextResponse.json({
      stripeCustomerId: dbUser?.stripeCustomerId || null,
      stripeSubscriptionId: dbUser?.stripeSubscriptionId || null,
      stripePriceId: dbUser?.stripePriceId || null,
      stripeCurrentPeriodEnd: dbUser?.stripeCurrentPeriodEnd || null,
      isPro,
    });
  } catch (error) {
    console.error("GET /api/billing error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
