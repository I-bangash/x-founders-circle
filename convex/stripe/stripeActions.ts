"use node";

import { v } from "convex/values";
import { Resend } from "resend";
import Stripe from "stripe";

import { api, internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { ActionCtx, internalAction } from "../_generated/server";

const resend = new Resend(process.env.RESEND_API_KEY);

type Metadata = {};

async function getBillingCycleAnchor(
  stripe: Stripe,
  subscriptionId: string
): Promise<number | undefined> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription.billing_cycle_anchor;
  } catch (error: any) {
    console.error(
      `Failed to fetch subscription ${subscriptionId}: ${error.message}`
    );
    return undefined;
  }
}

async function ensureStripeCustomer(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
  orgId: string,
  userId: string,
  isLifetimePlan: boolean
): Promise<string> {
  const existingCustomerId = session.customer as string | null;

  if (existingCustomerId) {
    return existingCustomerId;
  }

  if (!isLifetimePlan) {
    throw new Error("Missing customer ID for subscription plan");
  }

  const customer = await stripe.customers.create({
    email:
      session.customer_details?.email || session.customer_email || undefined,
    name: session.customer_details?.name || undefined,
    metadata: { orgId, userId },
  });

  return customer.id;
}

async function handleCheckoutCompleted(
  ctx: ActionCtx,
  stripe: Stripe,
  session: Stripe.Checkout.Session
): Promise<void> {
  const orgId = session.metadata?.orgId;
  const userId = session.metadata?.userId;
  const planLookupKey = session.metadata?.planLookupKey;
  const interval = session.metadata?.interval;
  const subscriptionId = session.subscription as string | null;

  if (!orgId || !userId || !planLookupKey) {
    throw new Error("Missing required metadata in checkout session");
  }

  const isLifetimePlan = interval === "lifetime";
  const customerId = await ensureStripeCustomer(
    stripe,
    session,
    orgId,
    userId,
    isLifetimePlan
  );

  let billingCycleAnchor: number | undefined;
  if (subscriptionId) {
    billingCycleAnchor = await getBillingCycleAnchor(stripe, subscriptionId);
  }

  await ctx.runMutation(internal.stripe.billing.fulfillCheckout, {
    orgId,
    planLookupKey,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    billingCycleAnchor,
  });
}

async function handleSubscriptionUpdated(
  ctx: ActionCtx,
  subscription: Stripe.Subscription
): Promise<void> {
  const organizationId = subscription.metadata?.orgId;
  const priceLookupKey = subscription.items.data[0]?.price.lookup_key;

  if (!priceLookupKey || !organizationId) {
    console.error(
      `Missing lookup key or orgId for subscription ${subscription.id}`
    );
    return;
  }

  await ctx.runMutation(internal.stripe.billing.updateSubscriptionStatus, {
    orgId: organizationId,
    newPlanLookupKey: priceLookupKey,
    stripeSubscriptionId: subscription.id,
    stripeSubscriptionStatus: subscription.status,
    stripeCurrentPeriodEnd: subscription.items.data[0]?.current_period_end,
    billingCycleAnchor: subscription.billing_cycle_anchor,
  });
}

async function handleSubscriptionDeleted(
  ctx: ActionCtx,
  subscription: Stripe.Subscription
): Promise<void> {
  const organizationId = subscription.metadata?.orgId;

  if (!organizationId) {
    console.error(`Missing orgId metadata for subscription ${subscription.id}`);
    return;
  }

  await ctx.runMutation(
    internal.stripe.billing.handleSubscriptionCancellation,
    {
      orgId: organizationId,
      downgradePlanLookupKey: "free_trial",
    }
  );
}

function verifyWebhookSignature(
  stripe: Stripe,
  payload: string,
  signature: string,
  secret: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    throw new Error(`Webhook Error: ${error.message}`);
  }
}

export const fulfill = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async (ctx: ActionCtx, args) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-08-27.basil",
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET environment variable not set");
    }

    const event = verifyWebhookSignature(
      stripe,
      args.payload,
      args.signature,
      webhookSecret
    );

    try {
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutCompleted(
            ctx,
            stripe,
            event.data.object as Stripe.Checkout.Session
          );
          break;

        case "customer.subscription.updated":
          await handleSubscriptionUpdated(
            ctx,
            event.data.object as Stripe.Subscription
          );
          break;

        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(
            ctx,
            event.data.object as Stripe.Subscription
          );
          break;
      }

      return { success: true };
    } catch (error: any) {
      console.error("Mutation execution failed:", error);
      throw new Error(`Mutation Error: ${error.message}`);
    }
  },
});
