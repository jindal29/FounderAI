import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();
  const signature = headerPayload.get("Stripe-Signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET in environment variables");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  if (!signature) {
    return new Response("Missing Stripe-Signature header", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  try {
    if (event.type === "checkout.session.completed") {
      const userId = session.client_reference_id;
      const stripeCustomerId = session.customer as string;
      const stripeSubscriptionId = session.subscription as string;

      if (!userId) {
        return new Response("Missing client reference (User ID)", { status: 400 });
      }

      // Retrieve subscription to get period dates and price details
      const subscription = (await stripe.subscriptions.retrieve(stripeSubscriptionId)) as any;

      await db.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId,
          stripeSubscriptionId,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });

      console.log(`Stripe subscription completed for User ${userId}`);
    }

    if (event.type === "invoice.payment_succeeded") {
      const stripeSubscriptionId = session.subscription as string;

      if (stripeSubscriptionId) {
        const subscription = (await stripe.subscriptions.retrieve(stripeSubscriptionId)) as any;

        await db.user.update({
          where: { stripeSubscriptionId },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
        console.log(`Stripe invoice payment succeeded for subscription ${stripeSubscriptionId}`);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const stripeSubscriptionId = session.id as string;

      await db.user.update({
        where: { stripeSubscriptionId },
        data: {
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
          stripeSubscriptionId: null,
        },
      });
      console.log(`Stripe subscription cancelled/deleted: ${stripeSubscriptionId}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing Stripe webhook database operations:", error);
    return NextResponse.json({ error: "Webhook database sync failed" }, { status: 500 });
  }
}
