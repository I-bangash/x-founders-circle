// convex/billing.ts
import { v } from "convex/values";

import { api, internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  internalQuery,
} from "../_generated/server";

// Import plan definitions if needed, but fetching by lookupKey is better

// Helper type for OrganizationLimits updates
type LimitsPatchData = Partial<Doc<"organizationLimits">>;
// Helper type for Organization updates
type OrgPatchData = Partial<Doc<"organizations">>;

// --- Internal Helper to get Plan by Lookup Key ---
// (Could also use the public query if auth allows, but internal might be safer)
export const getPlanByLookupKeyInternal = internalQuery({
  args: { lookupKey: v.string() },
  handler: async (ctx, args) => {
    const plan = await ctx.db
      .query("plans")
      .withIndex("by_lookup_key", (q) => q.eq("lookupKey", args.lookupKey))
      .filter((q) => q.eq(q.field("isActive"), true)) // Important: only consider active plans
      .unique();
    return plan;
  },
});

// --- Internal Helper to update Org Limits based on a Plan ---
export async function updateOrgLimitsForPlan(
  ctx: MutationCtx,
  orgId: string,
  plan: Doc<"plans">
) {
  const limits = await ctx.db
    .query("organizationLimits")
    .withIndex("by_organizationId", (q) => q.eq("organizationId", orgId))
    .unique();

  if (!limits) {
    console.error(
      `[updateOrgLimitsForPlan] Limits not found for org ${orgId} during plan update.`
    );
    // Consider creating limits here if they somehow don't exist, or throw
    throw new Error(`OrganizationLimits not found for org ${orgId}`);
  }

  // Prepare the patch data based on the new plan's limits
  const limitsPatch: LimitsPatchData = {
    planId: plan._id,
    planType: plan.planType,
    monthlyCreditsLimit: plan.monthlyCreditsLimit,
    projectsLimit: plan.projectsLimit,
    teamMembersLimit: plan.teamMembersLimit,
    storageLimitBytes: plan.storageLimitBytes,
    // Reset period usage counters
    monthlyCreditsUsed: 0,
    lastUsageReset: Date.now(), // Reset the timer
  };

  await ctx.db.patch(limits._id, limitsPatch);
  console.log(
    `[updateOrgLimitsForPlan] Updated limits for org ${orgId} to plan ${plan.name}`
  );
}

// --- NEW: Internal Mutation to Reset Monthly Usage ---
/**
 * Resets monthly usage counters for a given organization.
 * Called by Stripe webhook (invoice.paid) or daily cron job.
 */
export const resetMonthlyUsageForOrg = internalMutation({
  args: {
    organizationId: v.string(), // Changed from v.id("organizations") to v.string()
  },
  handler: async (ctx, args) => {
    console.log(
      `[resetMonthlyUsageForOrg] Attempting reset for org: ${args.organizationId}`
    );
    const limits = await ctx.db
      .query("organizationLimits")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .unique();

    if (!limits) {
      console.error(
        `[resetMonthlyUsageForOrg] Limits not found for org ${args.organizationId}. Cannot reset.`
      );
      return { success: false, error: "Limits record not found." };
    }

    // Only reset if enough time has passed (e.g., > 25 days) to prevent accidental double resets
    const twentyFiveDaysInMs = 25 * 24 * 60 * 60 * 1000;
    if (Date.now() - limits.lastUsageReset < twentyFiveDaysInMs) {
      console.log(
        `[resetMonthlyUsageForOrg] Skipping reset for org ${args.organizationId}, last reset was too recent (${new Date(limits.lastUsageReset).toISOString()}).`
      );
      return { success: true, message: "Reset not due yet." };
    }

    const resetPatch: Partial<Doc<"organizationLimits">> = {
      monthlyCreditsUsed: 0,
      lastUsageReset: Date.now(),
    };

    await ctx.db.patch(limits._id, resetPatch);
    console.log(
      `[resetMonthlyUsageForOrg] Successfully reset monthly usage for org ${args.organizationId}`
    );
    return { success: true };
  },
});

// ============================================================================
// Billing Mutations (Called by Stripe Action)
// ============================================================================

/**
 * Fulfills a successful checkout session (Subscription start or LTD purchase).
 * Updates the organization's plan and limits.
 */
export const fulfillCheckout = internalMutation({
  args: {
    orgId: v.string(),
    planLookupKey: v.string(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.optional(v.union(v.string(), v.null())), // Null for LTD
    billingCycleAnchor: v.optional(v.number()), // Stripe timestamp (seconds)
  },
  handler: async (ctx, args) => {
    console.log(
      `[fulfillCheckout] Fulfilling for org: ${args.orgId}, plan: ${args.planLookupKey}`
    );

    // 1. Find the target plan
    const targetPlan = await ctx.runQuery(
      internal.stripe.billing.getPlanByLookupKeyInternal,
      {
        lookupKey: args.planLookupKey,
      }
    );
    if (!targetPlan) {
      throw new Error(
        `Plan with lookup key "${args.planLookupKey}" not found or inactive.`
      );
    }

    // Calculate billing anchor day
    let billingAnchorDay: number | undefined = undefined;
    if (args.billingCycleAnchor) {
      // Convert Stripe seconds timestamp to Date object in UTC
      const anchorDate = new Date(args.billingCycleAnchor * 1000);
      // Get the day of the month (1-31) in UTC
      billingAnchorDay = anchorDate.getUTCDate();
      console.log(
        `[fulfillCheckout] Calculated billing anchor day: ${billingAnchorDay} for org ${args.orgId}`
      );
    } else if (targetPlan.planType === "monthly") {
      // Fallback if anchor not provided for a monthly plan (e.g., during initial checkout)
      // Set anchor day based on today's date in UTC
      billingAnchorDay = new Date().getUTCDate();
      console.log(
        `[fulfillCheckout] Setting anchor day to current UTC day: ${billingAnchorDay} for org ${args.orgId}`
      );
    }

    // 2. Prepare Organization update data
    const orgUpdate: OrgPatchData = {
      planId: targetPlan._id,
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId ?? undefined, // Set to undefined if null
      stripeSubscriptionStatus: args.stripeSubscriptionId
        ? "active"
        : undefined, // Active if it's a subscription
      stripeCurrentPeriodEnd: undefined, // Will be set by subscription.updated event
      isOnTrial: false, // End trial on purchase
      trialEndDate: undefined,
      lifetimeAccess: targetPlan.planType === "ltd", // Set LTD flag
      activeLtdCampaign:
        targetPlan.planType === "ltd"
          ? targetPlan.ltdCampaignIdentifier
          : undefined,
      // If this is the *first* LTD purchase for a campaign, set stacks to stackLevel
      // If stacking logic is needed here (e.g., upgrading LTD via checkout), add it
      totalStacksRedeemed:
        targetPlan.planType === "ltd" ? targetPlan.stackLevel : 0, // Assumes checkout = first stack/purchase
      ltdPurchaseDate: targetPlan.planType === "ltd" ? Date.now() : undefined,
      billingAnchorDay: billingAnchorDay, // Store the calculated anchor day
    };

    // Fetch org based on index of by_orgId
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .unique();

    if (!org) {
      throw new Error(`Organization ${args.orgId} not found.`);
    }

    // 3. Update the Organization
    await ctx.db.patch(org._id, orgUpdate);
    console.log(
      `[fulfillCheckout] Patched organization ${args.orgId} with plan ${targetPlan.name}`
    );

    // 4. Update OrganizationLimits based on the new plan
    await updateOrgLimitsForPlan(ctx, args.orgId, targetPlan);

    // 5. Optional: Send welcome email for the new plan
    // await ctx.runAction(internal.email.sendPlanWelcomeEmail, { orgId: args.orgId, planName: targetPlan.name });

    return { success: true };
  },
});

/**
 * Updates subscription status based on Stripe webhook events.
 * Handles upgrades, downgrades, renewals, and cancellations reflected in status.
 */
export const updateSubscriptionStatus = internalMutation({
  args: {
    orgId: v.string(),
    newPlanLookupKey: v.string(), // Lookup key from the updated subscription's price
    stripeSubscriptionId: v.string(),
    stripeSubscriptionStatus: v.string(), // e.g., "active", "past_due", "canceled"
    stripeCurrentPeriodEnd: v.number(), // Unix timestamp
    billingCycleAnchor: v.optional(v.number()), // Stripe timestamp (seconds)
  },
  handler: async (ctx, args) => {
    console.log(
      `[updateSubscriptionStatus] Updating for org: ${args.orgId}, sub: ${args.stripeSubscriptionId}, status: ${args.stripeSubscriptionStatus}, new key: ${args.newPlanLookupKey}`
    );
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .unique();

    if (!org) {
      console.error(
        `[updateSubscriptionStatus] Organization ${args.orgId} not found.`
      );
      throw new Error("Organization not found.");
    }

    // Calculate billing anchor day if provided
    let billingAnchorDay: number | undefined =
      org.billingAnchorDay ?? undefined; // Keep existing if not updated
    if (args.billingCycleAnchor) {
      const anchorDate = new Date(args.billingCycleAnchor * 1000);
      billingAnchorDay = anchorDate.getUTCDate();
      console.log(
        `[updateSubscriptionStatus] Updating billing anchor day to: ${billingAnchorDay} for org ${args.orgId}`
      );
    }

    // 1. Find the target plan
    const targetPlan = await ctx.runQuery(
      internal.stripe.billing.getPlanByLookupKeyInternal,
      {
        lookupKey: args.newPlanLookupKey,
      }
    );
    if (!targetPlan) {
      console.error(
        `[updateSubscriptionStatus] Target plan "${args.newPlanLookupKey}" not found for org ${args.orgId}. Cannot update.`
      );
      // Don't throw, just log, maybe the org is on an old/inactive plan key
      return { success: false, error: "Target plan not found" };
    }

    // 2. Find the Organization

    // Fetch org based on index of by_orgId

    // 3. Prepare Organization update data
    const planChanged = org.planId !== targetPlan._id;
    const orgUpdate: OrgPatchData = {
      stripeSubscriptionId: args.stripeSubscriptionId,
      stripeSubscriptionStatus: args.stripeSubscriptionStatus,
      stripeCurrentPeriodEnd: args.stripeCurrentPeriodEnd * 1000, // Convert Stripe seconds to ms
      billingAnchorDay: billingAnchorDay, // Update anchor day
      ...(planChanged && { planId: targetPlan._id }),
      // Reset LTD flags if moving to a monthly plan
      ...(targetPlan.planType === "monthly" && {
        lifetimeAccess: false,
        activeLtdCampaign: undefined,
      }),
    };

    // 4. Update Organization
    await ctx.db.patch(org._id, orgUpdate);
    console.log(
      `[updateSubscriptionStatus] Patched organization ${args.orgId} status to ${args.stripeSubscriptionStatus}`
    );

    // 5. Update Limits *only if the plan actually changed*
    if (planChanged) {
      console.log(
        `[updateSubscriptionStatus] Plan changed for org ${args.orgId}. Updating limits.`
      );
      await updateOrgLimitsForPlan(ctx, args.orgId, targetPlan);
      // Do we reset usage on upgrade/downgrade? Business decision.
      // The current updateOrgLimitsForPlan *does* reset period usage.
    }

    // 6. Handle specific statuses if needed (e.g., past_due -> send email)
    // if (args.stripeSubscriptionStatus === 'past_due') { ... }

    return { success: true };
  },
});

/**
 * Handles a deleted/fully canceled subscription.
 * Downgrades the organization to a specified plan (e.g., free trial).
 */
export const handleSubscriptionCancellation = internalMutation({
  args: {
    orgId: v.string(),
    downgradePlanLookupKey: v.string(), // e.g., "free_trial"
  },
  handler: async (ctx, args) => {
    console.log(
      `[handleSubscriptionCancellation] Handling cancellation for org: ${args.orgId}, downgrading to: ${args.downgradePlanLookupKey}`
    );

    // 1. Find the downgrade plan
    const downgradePlan = await ctx.runQuery(
      internal.stripe.billing.getPlanByLookupKeyInternal,
      {
        lookupKey: args.downgradePlanLookupKey,
      }
    );
    if (!downgradePlan) {
      console.error(
        `[handleSubscriptionCancellation] Downgrade plan "${args.downgradePlanLookupKey}" not found for org ${args.orgId}. Cannot downgrade.`
      );
      throw new Error(
        `Downgrade plan "${args.downgradePlanLookupKey}" not found.`
      );
    }

    // Fetch org based on index of by_orgId
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .unique();

    if (!org) {
      throw new Error(`Organization ${args.orgId} not found.`);
    }

    // 2. Prepare Organization update data
    const orgUpdate: OrgPatchData = {
      planId: downgradePlan._id,
      stripeSubscriptionId: undefined, // Changed null to undefined // Clear subscription info
      stripeSubscriptionStatus: "canceled", // Mark as canceled
      stripeCurrentPeriodEnd: undefined, // Changed null to undefined
      lifetimeAccess: false, // Ensure LTD is off
      activeLtdCampaign: undefined, // Changed null to undefined
      isOnTrial: downgradePlan.lookupKey === "free_trial", // Set trial if downgrading to trial
      trialEndDate: downgradePlan.lookupKey === "free_trial" ? 0 : undefined, // Changed null to undefined // Expire trial immediately if downgrading
    };

    // 3. Update Organization
    await ctx.db.patch(org._id, orgUpdate);
    console.log(
      `[handleSubscriptionCancellation] Downgraded org ${args.orgId} to plan ${downgradePlan.name}`
    );

    // 4. Update OrganizationLimits based on the downgrade plan
    await updateOrgLimitsForPlan(ctx, args.orgId, downgradePlan);

    // 5. Optional: Send cancellation/downgrade notification email
    // await ctx.runAction(internal.email.sendCancellationEmail, { orgId: args.orgId });

    return { success: true };
  },
});
