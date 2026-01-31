import { v } from "convex/values";

import { api, internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  internalQuery,
} from "../_generated/server";

type LimitsPatchData = Partial<Doc<"organizationLimits">>;
type OrgPatchData = Partial<Doc<"organizations">>;

export const getPlanByLookupKeyInternal = internalQuery({
  args: { lookupKey: v.string() },
  handler: async (ctx, args) => {
    const plan = await ctx.db
      .query("plans")
      .withIndex("by_lookup_key", (q) => q.eq("lookupKey", args.lookupKey))
      .filter((q) => q.eq(q.field("isActive"), true))
      .unique();
    return plan;
  },
});

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

    throw new Error(`OrganizationLimits not found for org ${orgId}`);
  }

  const limitsPatch: LimitsPatchData = {
    planId: plan._id,
    planType: plan.planType,
    monthlyCreditsLimit: plan.monthlyCreditsLimit,
    projectsLimit: plan.projectsLimit,
    teamMembersLimit: plan.teamMembersLimit,
    storageLimitBytes: plan.storageLimitBytes,
    monthlyCreditsUsed: 0,
    lastUsageReset: Date.now(),
  };

  await ctx.db.patch(limits._id, limitsPatch);
}

export const resetMonthlyUsageForOrg = internalMutation({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
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

    const twentyFiveDaysInMs = 25 * 24 * 60 * 60 * 1000;
    if (Date.now() - limits.lastUsageReset < twentyFiveDaysInMs) {
      return { success: true, message: "Reset not due yet." };
    }

    const resetPatch: Partial<Doc<"organizationLimits">> = {
      monthlyCreditsUsed: 0,
      lastUsageReset: Date.now(),
    };

    await ctx.db.patch(limits._id, resetPatch);

    return { success: true };
  },
});

export const fulfillCheckout = internalMutation({
  args: {
    orgId: v.string(),
    planLookupKey: v.string(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.optional(v.union(v.string(), v.null())),
    billingCycleAnchor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
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

    let billingAnchorDay: number | undefined = undefined;
    if (args.billingCycleAnchor) {
      const anchorDate = new Date(args.billingCycleAnchor * 1000);
      billingAnchorDay = anchorDate.getUTCDate();
    } else if (targetPlan.planType === "monthly") {
      billingAnchorDay = new Date().getUTCDate();
    }

    const orgUpdate: OrgPatchData = {
      planId: targetPlan._id,
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId ?? undefined,
      stripeSubscriptionStatus: args.stripeSubscriptionId
        ? "active"
        : undefined,
      stripeCurrentPeriodEnd: undefined,
      isOnTrial: false,
      trialEndDate: undefined,
      lifetimeAccess: targetPlan.planType === "ltd",
      activeLtdCampaign:
        targetPlan.planType === "ltd"
          ? targetPlan.ltdCampaignIdentifier
          : undefined,
      totalStacksRedeemed:
        targetPlan.planType === "ltd" ? targetPlan.stackLevel : 0,
      ltdPurchaseDate: targetPlan.planType === "ltd" ? Date.now() : undefined,
      billingAnchorDay: billingAnchorDay,
    };

    const org = await ctx.db
      .query("organizations")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .unique();

    if (!org) {
      throw new Error(`Organization ${args.orgId} not found.`);
    }

    await ctx.db.patch(org._id, orgUpdate);

    await updateOrgLimitsForPlan(ctx, args.orgId, targetPlan);

    return { success: true };
  },
});

export const updateSubscriptionStatus = internalMutation({
  args: {
    orgId: v.string(),
    newPlanLookupKey: v.string(),
    stripeSubscriptionId: v.string(),
    stripeSubscriptionStatus: v.string(),
    stripeCurrentPeriodEnd: v.number(),
    billingCycleAnchor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
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

    let billingAnchorDay: number | undefined =
      org.billingAnchorDay ?? undefined;
    if (args.billingCycleAnchor) {
      const anchorDate = new Date(args.billingCycleAnchor * 1000);
      billingAnchorDay = anchorDate.getUTCDate();
    }

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
      return { success: false, error: "Target plan not found" };
    }

    const planChanged = org.planId !== targetPlan._id;
    const orgUpdate: OrgPatchData = {
      stripeSubscriptionId: args.stripeSubscriptionId,
      stripeSubscriptionStatus: args.stripeSubscriptionStatus,
      stripeCurrentPeriodEnd: args.stripeCurrentPeriodEnd * 1000,
      billingAnchorDay: billingAnchorDay,
      ...(planChanged && { planId: targetPlan._id }),

      ...(targetPlan.planType === "monthly" && {
        lifetimeAccess: false,
        activeLtdCampaign: undefined,
      }),
    };

    await ctx.db.patch(org._id, orgUpdate);

    if (planChanged) {
      await updateOrgLimitsForPlan(ctx, args.orgId, targetPlan);
    }

    return { success: true };
  },
});

export const handleSubscriptionCancellation = internalMutation({
  args: {
    orgId: v.string(),
    downgradePlanLookupKey: v.string(),
  },
  handler: async (ctx, args) => {
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

    const org = await ctx.db
      .query("organizations")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .unique();

    if (!org) {
      throw new Error(`Organization ${args.orgId} not found.`);
    }

    const orgUpdate: OrgPatchData = {
      planId: downgradePlan._id,
      stripeSubscriptionId: undefined,
      stripeSubscriptionStatus: "canceled",
      stripeCurrentPeriodEnd: undefined,
      lifetimeAccess: false,
      activeLtdCampaign: undefined,
      isOnTrial: downgradePlan.lookupKey === "free_trial",
      trialEndDate: downgradePlan.lookupKey === "free_trial" ? 0 : undefined,
    };

    await ctx.db.patch(org._id, orgUpdate);

    await updateOrgLimitsForPlan(ctx, args.orgId, downgradePlan);

    return { success: true };
  },
});
