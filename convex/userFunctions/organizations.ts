import { ConvexError, v } from "convex/values";

import { Doc, Id } from "../_generated/dataModel";
import { internalQuery, mutation, query } from "../_generated/server";
import {
  getIdentityOrError,
  getIdentityOrThrow,
  handleConvexError,
} from "../helper/convexHelperFunctions";

type OrganizationResponse<T> = {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

type OrganizationData = Doc<"organizations">;

type OrgSubscriptionStatus = {
  id: Id<"organizations">;
  orgId: string;
  planId: Id<"plans"> | null;
  planLookupKey: string | null; // Include the lookup key for easy comparison
  planType: "monthly" | "ltd" | "free_trial" | null; // Add trial type
  stripeSubscriptionStatus: string | null;
  stripeCurrentPeriodEnd: number | null;
  lifetimeAccess: boolean;
  isOnTrial: boolean;
  trialEndDate: number | null;
};

type OrgSubscriptionResponse = {
  data?: OrgSubscriptionStatus | null; // Can return null if org not found
  error?: { code: string; message: string };
};

export const getOrganizationById = query({
  args: { organizationId: v.string() },
  handler: async (
    ctx,
    { organizationId }
  ): Promise<OrganizationResponse<OrganizationData | null>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      getIdentityOrThrow(identity);

      const organization = await ctx.db
        .query("organizations")
        .withIndex("by_orgId", (q) => q.eq("orgId", organizationId))
        .first();

      if (!organization) {
        return {
          error: {
            code: "NOT_FOUND",
            message: "Organization not found",
          },
        };
      }

      return { data: organization };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      };
    }
  },
});

export const getOrganizationByIdInternal = internalQuery({
  args: { organizationId: v.string() },
  handler: async (
    ctx,
    { organizationId }
  ): Promise<OrganizationResponse<OrganizationData | null>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      getIdentityOrThrow(identity);

      const organization = await ctx.db
        .query("organizations")
        .withIndex("by_orgId", (q) => q.eq("orgId", organizationId))
        .first();

      if (!organization) {
        return {
          error: {
            code: "NOT_FOUND",
            message: "Organization not found",
          },
        };
      }

      return { data: organization };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      };
    }
  },
});

export const createOrganization = mutation({
  args: {
    name: v.string(),
    image: v.optional(v.string()),
    avatarImage: v.optional(v.string()),
    planId: v.optional(v.id("plans")),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    stripeSubscriptionStatus: v.optional(v.string()),
    stripeCurrentPeriodEnd: v.optional(v.number()),
    lifetimeAccess: v.optional(v.boolean()),
    activeLtdCampaign: v.optional(v.string()),
    totalStacksRedeemed: v.optional(v.number()),
    ltdPurchaseDate: v.optional(v.number()),
    orgId: v.string(),
    userId: v.string(),
    isOnTrial: v.optional(v.boolean()),
    trialEndDate: v.optional(v.number()),
  },
  handler: async (
    ctx,
    args
  ): Promise<OrganizationResponse<OrganizationData>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      getIdentityOrThrow(identity);

      const newOrgId = await ctx.db.insert("organizations", {
        name: args.name,
        orgId: args.orgId,
        userId: args.userId,
        image: args.image,
        avatarName: undefined,
        avatarImage: args.avatarImage,
        planId: args.planId,
        stripeCustomerId: args.stripeCustomerId,
        stripeSubscriptionId: args.stripeSubscriptionId,
        stripeSubscriptionStatus: args.stripeSubscriptionStatus,
        stripeCurrentPeriodEnd: args.stripeCurrentPeriodEnd,
        lifetimeAccess: args.lifetimeAccess ?? false,
        activeLtdCampaign: args.activeLtdCampaign,
        totalStacksRedeemed: args.totalStacksRedeemed ?? 0,
        ltdPurchaseDate: args.ltdPurchaseDate,
        isOnTrial: args.isOnTrial ?? false,
        trialEndDate: args.trialEndDate,
      });

      const createdOrg = await ctx.db.get(newOrgId);

      if (!createdOrg) {
        throw new ConvexError({
          code: "CREATION_FAILED",
          message: "Failed to create organization",
        });
      }

      return { data: createdOrg };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      };
    }
  },
});

export const createOrganizationInternal = mutation({
  args: {
    name: v.string(),
    image: v.optional(v.string()),
    avatarImage: v.optional(v.string()),
    planId: v.optional(v.id("plans")),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    stripeSubscriptionStatus: v.optional(v.string()),
    stripeCurrentPeriodEnd: v.optional(v.number()),
    lifetimeAccess: v.optional(v.boolean()),
    activeLtdCampaign: v.optional(v.string()),
    totalStacksRedeemed: v.optional(v.number()),
    ltdPurchaseDate: v.optional(v.number()),
    orgId: v.string(),
    userId: v.string(),
    isOnTrial: v.optional(v.boolean()),
    trialEndDate: v.optional(v.number()),
  },
  handler: async (
    ctx,
    args
  ): Promise<OrganizationResponse<OrganizationData>> => {
    try {
      const insertData: Omit<Doc<"organizations">, "_id" | "_creationTime"> = {
        name: args.name,
        orgId: args.orgId,
        userId: args.userId,
        lifetimeAccess: args.lifetimeAccess ?? false,
        totalStacksRedeemed: args.totalStacksRedeemed ?? 0,
        isOnTrial: args.isOnTrial ?? false,
      };

      if (args.image !== undefined) insertData.image = args.image;
      if (args.avatarImage !== undefined)
        insertData.avatarImage = args.avatarImage;
      if (args.planId !== undefined) insertData.planId = args.planId;
      if (args.stripeCustomerId !== undefined)
        insertData.stripeCustomerId = args.stripeCustomerId;
      if (args.stripeSubscriptionId !== undefined)
        insertData.stripeSubscriptionId = args.stripeSubscriptionId;
      if (args.stripeSubscriptionStatus !== undefined)
        insertData.stripeSubscriptionStatus = args.stripeSubscriptionStatus;
      if (args.stripeCurrentPeriodEnd !== undefined)
        insertData.stripeCurrentPeriodEnd = args.stripeCurrentPeriodEnd;
      if (args.activeLtdCampaign !== undefined)
        insertData.activeLtdCampaign = args.activeLtdCampaign;
      if (args.ltdPurchaseDate !== undefined)
        insertData.ltdPurchaseDate = args.ltdPurchaseDate;
      if (args.trialEndDate !== undefined)
        insertData.trialEndDate = args.trialEndDate;

      const newOrgId = await ctx.db.insert("organizations", insertData);

      const createdOrg = await ctx.db.get(newOrgId);

      if (!createdOrg) {
        throw new ConvexError({
          code: "CREATION_FAILED",
          message: "Failed to create organization",
        });
      }

      return { data: createdOrg };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      };
    }
  },
});

export const updateOrganization = mutation({
  args: {
    organizationId: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    avatarImage: v.optional(v.string()),
    planId: v.optional(v.id("plans")),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    stripeSubscriptionStatus: v.optional(v.string()),
    stripeCurrentPeriodEnd: v.optional(v.number()),
    lifetimeAccess: v.optional(v.boolean()),
    activeLtdCampaign: v.optional(v.string()),
    totalStacksRedeemed: v.optional(v.number()),
    ltdPurchaseDate: v.optional(v.number()),
  },
  handler: async (
    ctx,
    args
  ): Promise<OrganizationResponse<OrganizationData>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      getIdentityOrThrow(identity);

      const existingOrg = await ctx.db
        .query("organizations")
        .withIndex("by_orgId", (q) => q.eq("orgId", args.organizationId))
        .first();

      if (!existingOrg) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: "Organization not found",
        });
      }

      const updateData = {
        ...(args.name !== undefined && { name: args.name }),
        ...(args.image !== undefined && { image: args.image }),
        ...(args.avatarImage !== undefined && {
          avatarImage: args.avatarImage,
        }),
        ...(args.planId !== undefined && { planId: args.planId }),
        ...(args.stripeCustomerId !== undefined && {
          stripeCustomerId: args.stripeCustomerId,
        }),
        ...(args.stripeSubscriptionId !== undefined && {
          stripeSubscriptionId: args.stripeSubscriptionId,
        }),
        ...(args.stripeSubscriptionStatus !== undefined && {
          stripeSubscriptionStatus: args.stripeSubscriptionStatus,
        }),
        ...(args.stripeCurrentPeriodEnd !== undefined && {
          stripeCurrentPeriodEnd: args.stripeCurrentPeriodEnd,
        }),
        ...(args.lifetimeAccess !== undefined && {
          lifetimeAccess: args.lifetimeAccess,
        }),
        ...(args.activeLtdCampaign !== undefined && {
          activeLtdCampaign: args.activeLtdCampaign,
        }),
        ...(args.totalStacksRedeemed !== undefined && {
          totalStacksRedeemed: args.totalStacksRedeemed,
        }),
        ...(args.ltdPurchaseDate !== undefined && {
          ltdPurchaseDate: args.ltdPurchaseDate,
        }),
      };

      await ctx.db.patch(existingOrg._id, updateData);

      const updatedOrg = await ctx.db.get(existingOrg._id);

      if (!updatedOrg) {
        throw new ConvexError({
          code: "UPDATE_FAILED",
          message: "Failed to update organization",
        });
      }

      return { data: updatedOrg };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      };
    }
  },
});

export const updateOrganizationInternal = mutation({
  args: {
    organizationId: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    avatarImage: v.optional(v.string()),
    plan: v.optional(v.string()),
    isOnTrial: v.optional(v.boolean()),
    trialStartDate: v.optional(v.number()),
  },
  handler: async (
    ctx,
    {
      organizationId,
      name,
      image,
      avatarImage,
      plan,
      isOnTrial,
      trialStartDate,
    }
  ): Promise<OrganizationResponse<OrganizationData>> => {
    try {
      const existingOrg = await ctx.db
        .query("organizations")
        .withIndex("by_orgId", (q) => q.eq("orgId", organizationId))
        .first();

      if (!existingOrg) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: "Organization not found",
        });
      }

      const updateData = {
        ...(name !== undefined && { name }),
        ...(image !== undefined && { image }),
        ...(avatarImage !== undefined && { avatarImage }),
        ...(plan !== undefined && { plan }),
        ...(isOnTrial !== undefined && { isOnTrial }),
        ...(trialStartDate !== undefined && { trialStartDate }),
      };

      await ctx.db.patch(existingOrg._id, updateData);

      const updatedOrg = await ctx.db.get(existingOrg._id);

      if (!updatedOrg) {
        throw new ConvexError({
          code: "UPDATE_FAILED",
          message: "Failed to update organization",
        });
      }

      return { data: updatedOrg };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      };
    }
  },
});

export const deleteOrganization = mutation({
  args: { organizationId: v.string() },
  handler: async (
    ctx,
    { organizationId }
  ): Promise<OrganizationResponse<boolean>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      getIdentityOrThrow(identity);

      const existingOrg = await ctx.db
        .query("organizations")
        .withIndex("by_orgId", (q) => q.eq("orgId", organizationId))
        .first();

      if (!existingOrg) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: "Organization not found",
        });
      }

      await ctx.db.delete(existingOrg._id);

      return { data: true };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      };
    }
  },
});

/**
 * Fetches the current subscription/plan status for the user's active organization.
 */
export const getOrgSubscriptionStatus = query({
  args: { callingFunction: v.string() },
  handler: async (
    ctx,
    { callingFunction }
  ): Promise<OrgSubscriptionResponse> => {
    const identity = await ctx.auth.getUserIdentity();
    const identityResult = getIdentityOrError(
      identity,
      callingFunction + "- getOrgSubscriptionStatus"
    );

    if (!identityResult.success) {
      return {
        data: null,
        error: identityResult.error,
      };
    }

    const { orgId } = identityResult.data;

    try {
      const org = await ctx.db
        .query("organizations")
        .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
        .first();

      if (!org) {
        console.warn(
          `getOrgSubscriptionStatus: Organization ${orgId} not found in DB.`,
          "Calling function:",
          callingFunction
        );
        return { data: null };
      }

      let planLookupKey: string | null = null;
      let planType: OrgSubscriptionStatus["planType"] = null;

      if (org.planId) {
        const plan = await ctx.db.get(org.planId);
        planLookupKey = plan?.lookupKey ?? null;
        planType =
          (plan?.planType as OrgSubscriptionStatus["planType"]) ?? null;
      }

      const statusData: OrgSubscriptionStatus = {
        id: org._id,
        orgId: org.orgId,
        planId: org.planId ?? null,
        planLookupKey: planLookupKey,
        planType: planType,
        stripeSubscriptionStatus: org.stripeSubscriptionStatus ?? null,
        stripeCurrentPeriodEnd: org.stripeCurrentPeriodEnd ?? null,
        lifetimeAccess: org.lifetimeAccess ?? false,
        isOnTrial: org.isOnTrial ?? false,
        trialEndDate: org.trialEndDate ?? null,
      };

      return { data: statusData };
    } catch (error: any) {
      console.error(
        "[getOrgSubscriptionStatus] Error fetching org status:",
        error,
        "Calling function:",
        callingFunction
      );
      return {
        error: {
          code: "DATABASE_ERROR",
          message: "Failed to fetch organization status.",
        },
      };
    }
  },
});

export const getOrgSubscriptionStatusInternal = query({
  args: { orgId: v.string() },
  handler: async (ctx, { orgId }): Promise<OrgSubscriptionResponse> => {
    if (!orgId) {
      return { data: null };
    }

    try {
      const org = await ctx.db
        .query("organizations")
        .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
        .first();

      if (!org) {
        console.warn(
          `getOrgSubscriptionStatus: Organization ${orgId} not found in DB.`
        );
        return { data: null };
      }

      let planLookupKey: string | null = null;
      let planType: OrgSubscriptionStatus["planType"] = null;

      if (org.planId) {
        const plan = await ctx.db.get(org.planId);
        planLookupKey = plan?.lookupKey ?? null;
        if (plan?.lookupKey === "free_trial") {
          planType = "free_trial";
        } else {
          planType =
            (plan?.planType as OrgSubscriptionStatus["planType"]) ?? null;
        }
      } else if (org.isOnTrial) {
        planType = "free_trial";
      }

      const statusData: OrgSubscriptionStatus = {
        id: org._id,
        orgId: org.orgId,
        planId: org.planId ?? null,
        planLookupKey: planLookupKey,
        planType: planType,
        stripeSubscriptionStatus: org.stripeSubscriptionStatus ?? null,
        stripeCurrentPeriodEnd: org.stripeCurrentPeriodEnd ?? null,
        lifetimeAccess: org.lifetimeAccess ?? false,
        isOnTrial: org.isOnTrial ?? false,
        trialEndDate: org.trialEndDate ?? null,
      };

      return { data: statusData };
    } catch (error: any) {
      console.error(
        "[getOrgSubscriptionStatus] Error fetching org status:",
        error
      );
      return {
        error: {
          code: "DATABASE_ERROR",
          message: "Failed to fetch organization status.",
        },
      };
    }
  },
});
