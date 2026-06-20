import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const email = user.emailAddresses[0].emailAddress;

    // Check if user has Stripe Customer ID in DB
    const dbUser = await db.user.findUnique({
      where: { id: userId },
    });

    let customerId = dbUser?.stripeCustomerId;

    if (!customerId) {
      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || undefined,
        metadata: {
          userId,
        },
      });
      customerId = customer.id;

      // Update database
      await db.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${appUrl}/dashboard/billing?success=true`;
    const cancelUrl = `${appUrl}/dashboard/billing?canceled=true`;

    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO;
    if (!priceId) {
      return new Response("Stripe Price ID for Pro plan not configured", { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return new Response("Stripe Checkout Error", { status: 500 });
  }
}
