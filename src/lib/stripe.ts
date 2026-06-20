import Stripe from "stripe";

const stripeApiKey = process.env.STRIPE_API_KEY || "sk_test_dummy_key_for_nextjs_build";

export const stripe = new Stripe(stripeApiKey, {
  apiVersion: "2026-05-27.dahlia",
  typescript: true,
});
