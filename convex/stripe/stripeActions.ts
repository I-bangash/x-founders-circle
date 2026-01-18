"use node";

import { v } from "convex/values";
import { Resend } from "resend";
import Stripe from "stripe";

import { api, internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { ActionCtx, internalAction } from "../_generated/server";

const resend = new Resend(process.env.RESEND_API_KEY);

type Metadata = {
  // metadata you passed during checkout creation
};

// Use internalAction as this is called by your http endpoint
export const fulfill = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async (ctx: ActionCtx, args) => {
    // Use ActionCtx
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      // Use STRIPE_SECRET_KEY
      apiVersion: "2025-08-27.basil", // Use a recent, stable API version
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET environment variable not set.");
    }

    let event: Stripe.Event;

    // 1. Verify Webhook Signature
    try {
      event = stripe.webhooks.constructEvent(
        args.payload, // Use payload from args
        args.signature, // Use signature from args
        webhookSecret
      );
    } catch (err: any) {
      console.error(
        `❌ Error verifying Stripe webhook signature: ${err.message}`
      );
      // Throwing an error here will signal failure back to the httpAction
      throw new Error(`Webhook Error: ${err.message}`);
    }

    // 2. Extract relevant data
    const session = event.data.object as Stripe.Checkout.Session;
    const subscription = event.data.object as Stripe.Subscription;

    console.log(`[Action] Received Stripe Event: ${event.type}`);

    // 3. Handle Specific Events by calling Mutations
    try {
      switch (event.type) {
        case "checkout.session.completed":
          console.log("[Action] Handling checkout.session.completed...");
          const checkoutSession = session;

          console.log(
            `[Action] Checkout session completed: ${JSON.stringify(
              checkoutSession
            )}`
          );
          // metadata:
          console.log(
            `[Action] Checkout session metadata: ${JSON.stringify(
              checkoutSession.metadata
            )}`
          );

          const orgId = checkoutSession.metadata?.orgId;
          const userId = checkoutSession.metadata?.userId;
          const planLookupKey = checkoutSession.metadata?.planLookupKey;
          const interval = checkoutSession.metadata?.interval;
          const stripeCustomerId = checkoutSession.customer as string | null;
          const stripeSubscriptionId = checkoutSession.subscription as
            | string
            | null;

          // --- Get Billing Cycle Anchor ---
          let billingCycleAnchor: number | undefined = undefined;
          if (stripeSubscriptionId) {
            // If it's a subscription, fetch the subscription object to get the anchor
            try {
              const subData =
                await stripe.subscriptions.retrieve(stripeSubscriptionId);
              billingCycleAnchor = subData.billing_cycle_anchor; // Timestamp in seconds
              console.log(
                `[Action] Retrieved billing_cycle_anchor: ${billingCycleAnchor} for sub: ${stripeSubscriptionId}`
              );
            } catch (subError: any) {
              console.warn(
                `[Action] Could not fetch subscription ${stripeSubscriptionId} to get anchor day during checkout completion: ${subError.message}`
              );
              // Continue without it, fulfillCheckout will handle undefined anchor
            }
          }
          // --- End Get Billing Cycle Anchor ---

          // For LTD (lifetime) plans, stripeCustomerId might be null since it's a one-time payment
          const isLtdPlan = interval === "lifetime";

          if (!orgId || !userId || !planLookupKey) {
            console.error(
              "Missing required metadata (orgId, userId, planLookupKey) in checkout session:",
              checkoutSession.id
            );
            throw new Error(
              "Webhook Error: Missing required metadata in session."
            );
          }

          // Handle customer ID: required for subscriptions, create for LTD if missing
          let finalStripeCustomerId = stripeCustomerId;

          if (!finalStripeCustomerId) {
            if (!isLtdPlan) {
              console.error(
                "Missing stripeCustomerId for subscription plan in checkout session:",
                checkoutSession.id
              );
              throw new Error(
                "Webhook Error: Missing customer ID for subscription plan."
              );
            } else {
              // For LTD plans, create a customer record using the customer details from the session
              console.log(
                `[Action] Creating Stripe customer for LTD purchase...`
              );
              try {
                const customer = await stripe.customers.create({
                  email:
                    checkoutSession.customer_details?.email ||
                    checkoutSession.customer_email ||
                    undefined,
                  name: checkoutSession.customer_details?.name || undefined,
                  metadata: {
                    orgId: orgId,
                    userId: userId,
                  },
                });
                console.log(`[Action] Created Stripe customer: ${customer.id}`);
                finalStripeCustomerId = customer.id;
              } catch (customerError: any) {
                console.error(
                  `[Action] Failed to create Stripe customer: ${customerError.message}`
                );
                throw new Error(
                  `Webhook Error: Failed to create customer record: ${customerError.message}`
                );
              }
            }
          }

          // Call the billing mutation to handle fulfillment
          await ctx.runMutation(internal.stripe.billing.fulfillCheckout, {
            orgId: orgId,
            planLookupKey: planLookupKey,
            stripeCustomerId: finalStripeCustomerId,
            stripeSubscriptionId: stripeSubscriptionId,
            billingCycleAnchor: billingCycleAnchor,
          });
          console.log(
            `[Action] Called fulfillCheckout mutation for org ${orgId}`
          );
          break;

        case "customer.subscription.updated":
          console.log("[Action] Handling customer.subscription.updated...");
          const updatedSubscription = subscription;
          const subOrgId = updatedSubscription.metadata?.orgId;
          const subCustomerId = updatedSubscription.customer as string;
          const newPriceLookupKey =
            updatedSubscription.items.data[0]?.price.lookup_key;

          if (!newPriceLookupKey || !subOrgId) {
            console.error(
              "Missing lookup key or orgId metadata on updated subscription",
              updatedSubscription.id
            );
            // Don't throw, just log and maybe skip processing this update
            break;
          }

          // Call the billing mutation to update status
          await ctx.runMutation(
            internal.stripe.billing.updateSubscriptionStatus,
            {
              // Use internal.billing...
              orgId: subOrgId,
              newPlanLookupKey: newPriceLookupKey,
              stripeSubscriptionId: updatedSubscription.id,
              stripeSubscriptionStatus: updatedSubscription.status,
              stripeCurrentPeriodEnd:
                updatedSubscription.items.data[0]?.current_period_end,
              // Pass the anchor date from the updated subscription object
              billingCycleAnchor: updatedSubscription.billing_cycle_anchor,
            }
          );
          console.log(
            `[Action] Called updateSubscriptionStatus mutation for org ${subOrgId}`
          );
          break;

        case "customer.subscription.deleted":
          console.log("[Action] Handling customer.subscription.deleted...");
          const deletedSubscription = subscription;
          const deletedSubOrgId = deletedSubscription.metadata?.orgId; // Relies on metadata set during creation

          if (!deletedSubOrgId) {
            console.error(
              "Missing orgId metadata on deleted subscription",
              deletedSubscription.id
            );
            // Attempt lookup by customer ID if necessary (requires index)
            // const org = await ctx.runQuery(internal.organizations.getOrgByStripeCustomerId, { stripeCustomerId: deletedSubscription.customer as string });
            // if (!org) { ... break ... }
            // deletedSubOrgId = org._id;
            break; // Skip if we can't identify the org
          }

          // Call the billing mutation to handle cancellation
          await ctx.runMutation(
            internal.stripe.billing.handleSubscriptionCancellation,
            {
              // Use internal.billing...
              orgId: deletedSubOrgId,
              downgradePlanLookupKey: "free_trial", // Or another default/canceled plan key
            }
          );
          console.log(
            `[Action] Called handleSubscriptionCancellation mutation for org ${deletedSubOrgId}`
          );
          break;

        // Add other event handlers (e.g., invoice.payment_failed) if needed

        default:
          console.log(`[Action] Unhandled Stripe event type: ${event.type}`);
      }

      // If all mutation calls succeed without throwing, return success
      return { success: true };
    } catch (err: any) {
      console.error("[Action] Error calling mutation:", err);
      // Rethrow the error to signal failure back to the httpAction
      throw new Error(`Mutation Error: ${err.message}`);
    }
  },
});
