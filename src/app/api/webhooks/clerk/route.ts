import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET in environment variables");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred -- verification failed", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (!id) {
    return new Response("Error occurred -- no user id found in event", {
      status: 400,
    });
  }

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const email = evt.data.email_addresses?.[0]?.email_address;
      const firstName = evt.data.first_name || "";
      const lastName = evt.data.last_name || "";
      const name = `${firstName} ${lastName}`.trim();
      const imageUrl = evt.data.image_url;

      if (!email) {
        return new Response("Error occurred -- user email not found", {
          status: 400,
        });
      }

      await db.user.upsert({
        where: { id },
        update: {
          email,
          name: name || null,
          imageUrl: imageUrl || null,
        },
        create: {
          id,
          email,
          name: name || null,
          imageUrl: imageUrl || null,
        },
      });

      return NextResponse.json({ message: "User synced successfully" }, { status: 200 });
    }

    if (eventType === "user.deleted") {
      await db.user.delete({
        where: { id },
      });
      return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    }

    return NextResponse.json({ message: `Unhandled event type: ${eventType}` }, { status: 200 });
  } catch (error) {
    console.error("Error processing Clerk webhook database operations:", error);
    return NextResponse.json({ error: "Database operation failed" }, { status: 500 });
  }
}
