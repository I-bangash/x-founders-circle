// convex/mainSaas/organizationLimits.ts
import { ConvexError, v } from "convex/values";

import { Doc, Id } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";
import {
  getIdentityOrThrow,
  handleConvexError,
} from "../helper/convexHelperFunctions";

// Types for error handling
type OrganizationLimitsResponse<T> = {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

type OrganizationLimitsData = Doc<"organizationLimits">;

// Get organization limits by organization ID
export const getOrganizationLimits = query({
  args: { organizationId: v.string() },
  handler: async (
    ctx,
    { organizationId }
  ): Promise<OrganizationLimitsResponse<OrganizationLimitsData | null>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      getIdentityOrThrow(identity);

      const limits = await ctx.db
        .query("organizationLimits")
        .withIndex("by_organizationId", (q) =>
          q.eq("organizationId", organizationId)
        )
        .first();

      if (!limits) {
        return {
          error: {
            code: "NOT_FOUND",
            message: "Organization limits not found",
          },
        };
      }

      return { data: limits };
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

// Create organization limits
export const createOrganizationLimits = mutation({
  args: {
    organizationId: v.string(),
    planId: v.id("plans"),
    planType: v.union(v.literal("monthly"), v.literal("ltd")),
    monthlyCreditsUsed: v.optional(v.number()),
    monthlyCreditsLimit: v.number(),
    extraCredits: v.optional(v.number()),
    lastUsageReset: v.optional(v.number()),
    projectsCurrent: v.optional(v.number()),
    projectsLimit: v.number(),
    teamMembersCurrent: v.optional(v.number()),
    teamMembersLimit: v.number(),
    storageUsedBytes: v.optional(v.number()),
    storageLimitBytes: v.number(),
  },
  handler: async (
    ctx,
    args
  ): Promise<OrganizationLimitsResponse<OrganizationLimitsData>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      getIdentityOrThrow(identity);

      // Check if limits already exist for this organization
      const existingLimits = await ctx.db
        .query("organizationLimits")
        .withIndex("by_organizationId", (q) =>
          q.eq("organizationId", args.organizationId)
        )
        .first();

      if (existingLimits) {
        throw new ConvexError({
          code: "LIMITS_EXIST",
          message: "Organization limits already exist",
        });
      }

      const limitsId = await ctx.db.insert("organizationLimits", {
        organizationId: args.organizationId,
        planId: args.planId,
        planType: args.planType,
        monthlyCreditsUsed: args.monthlyCreditsUsed ?? 0,
        monthlyCreditsLimit: args.monthlyCreditsLimit,
        extraCredits: args.extraCredits ?? 0,
        lastUsageReset: args.lastUsageReset ?? Date.now(),
        projectsCurrent: args.projectsCurrent ?? 0,
        projectsLimit: args.projectsLimit,
        teamMembersCurrent: args.teamMembersCurrent ?? 0,
        teamMembersLimit: args.teamMembersLimit,
        storageUsedBytes: args.storageUsedBytes ?? 0,
        storageLimitBytes: args.storageLimitBytes,
        updatedAt: Date.now(),
      });

      const createdLimits = await ctx.db.get(limitsId);

      if (!createdLimits) {
        throw new ConvexError({
          code: "CREATION_FAILED",
          message: "Failed to create organization limits",
        });
      }

      return { data: createdLimits };
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

// Create organization limits (internal)
export const createOrganizationLimitsInternal = mutation({
  args: {
    organizationId: v.string(),
    planId: v.id("plans"),
    planType: v.union(v.literal("monthly"), v.literal("ltd")),
    monthlyCreditsUsed: v.optional(v.number()),
    monthlyCreditsLimit: v.number(),
    extraCredits: v.optional(v.number()),
    lastUsageReset: v.optional(v.number()),
    projectsCurrent: v.optional(v.number()),
    projectsLimit: v.number(),
    teamMembersCurrent: v.optional(v.number()),
    teamMembersLimit: v.number(),
    storageUsedBytes: v.optional(v.number()),
    storageLimitBytes: v.number(),
  },
  handler: async (
    ctx,
    args
  ): Promise<OrganizationLimitsResponse<OrganizationLimitsData>> => {
    try {
      // Check if limits already exist for this organization
      const existingLimits = await ctx.db
        .query("organizationLimits")
        .withIndex("by_organizationId", (q) =>
          q.eq("organizationId", args.organizationId)
        )
        .first();

      if (existingLimits) {
        throw new ConvexError({
          code: "LIMITS_EXIST",
          message: "Organization limits already exist",
        });
      }

      const limitsId = await ctx.db.insert("organizationLimits", {
        organizationId: args.organizationId,
        planId: args.planId,
        planType: args.planType,
        monthlyCreditsUsed: args.monthlyCreditsUsed ?? 0,
        monthlyCreditsLimit: args.monthlyCreditsLimit,
        extraCredits: args.extraCredits ?? 0,
        lastUsageReset: args.lastUsageReset ?? Date.now(),
        projectsCurrent: args.projectsCurrent ?? 0,
        projectsLimit: args.projectsLimit,
        teamMembersCurrent: args.teamMembersCurrent ?? 0,
        teamMembersLimit: args.teamMembersLimit,
        storageUsedBytes: args.storageUsedBytes ?? 0,
        storageLimitBytes: args.storageLimitBytes,
        updatedAt: Date.now(),
      });

      const createdLimits = await ctx.db.get(limitsId);

      if (!createdLimits) {
        throw new ConvexError({
          code: "CREATION_FAILED",
          message: "Failed to create organization limits",
        });
      }

      return { data: createdLimits };
    } catch (error) {
      console.error(
        "[ORG.CREATED] Error creating organization limits for org:",
        args.organizationId,
        error
      );
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

// Update organization limits
export const updateOrganizationLimits = mutation({
  args: {
    organizationId: v.string(),
    planId: v.optional(v.id("plans")),
    planType: v.optional(v.union(v.literal("monthly"), v.literal("ltd"))),
    monthlyCreditsUsed: v.optional(v.number()),
    monthlyCreditsLimit: v.optional(v.number()),
    extraCredits: v.optional(v.number()),
    lastUsageReset: v.optional(v.number()),
    projectsCurrent: v.optional(v.number()),
    projectsLimit: v.optional(v.number()),
    teamMembersCurrent: v.optional(v.number()),
    teamMembersLimit: v.optional(v.number()),
    storageUsedBytes: v.optional(v.number()),
    storageLimitBytes: v.optional(v.number()),
  },
  handler: async (
    ctx,
    args
  ): Promise<OrganizationLimitsResponse<OrganizationLimitsData>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      getIdentityOrThrow(identity);

      const existingLimits = await ctx.db
        .query("organizationLimits")
        .withIndex("by_organizationId", (q) =>
          q.eq("organizationId", args.organizationId)
        )
        .first();

      if (!existingLimits) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: "Organization limits not found",
        });
      }

      // Only update fields that are provided
      const updateData = {
        ...(args.planId !== undefined && { planId: args.planId }),
        ...(args.planType !== undefined && { planType: args.planType }),
        ...(args.monthlyCreditsUsed !== undefined && {
          monthlyCreditsUsed: args.monthlyCreditsUsed,
        }),
        ...(args.monthlyCreditsLimit !== undefined && {
          monthlyCreditsLimit: args.monthlyCreditsLimit,
        }),
        ...(args.extraCredits !== undefined && {
          extraCredits: args.extraCredits,
        }),
        ...(args.lastUsageReset !== undefined && {
          lastUsageReset: args.lastUsageReset,
        }),
        ...(args.projectsCurrent !== undefined && {
          projectsCurrent: args.projectsCurrent,
        }),
        ...(args.projectsLimit !== undefined && {
          projectsLimit: args.projectsLimit,
        }),
        ...(args.teamMembersCurrent !== undefined && {
          teamMembersCurrent: args.teamMembersCurrent,
        }),
        ...(args.teamMembersLimit !== undefined && {
          teamMembersLimit: args.teamMembersLimit,
        }),
        ...(args.storageUsedBytes !== undefined && {
          storageUsedBytes: args.storageUsedBytes,
        }),
        ...(args.storageLimitBytes !== undefined && {
          storageLimitBytes: args.storageLimitBytes,
        }),
        updatedAt: Date.now(),
      };

      await ctx.db.patch(existingLimits._id, updateData);

      const updatedLimits = await ctx.db.get(existingLimits._id);

      if (!updatedLimits) {
        throw new ConvexError({
          code: "UPDATE_FAILED",
          message: "Failed to update organization limits",
        });
      }

      return { data: updatedLimits };
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

// Delete organization limits
export const deleteOrganizationLimits = mutation({
  args: { organizationId: v.string() },
  handler: async (
    ctx,
    { organizationId }
  ): Promise<OrganizationLimitsResponse<boolean>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      getIdentityOrThrow(identity);

      const existingLimits = await ctx.db
        .query("organizationLimits")
        .withIndex("by_organizationId", (q) =>
          q.eq("organizationId", organizationId)
        )
        .first();

      if (!existingLimits) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: "Organization limits not found",
        });
      }

      await ctx.db.delete(existingLimits._id);

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

// Increment usage for a specific feature
export const incrementUsage = mutation({
  args: {
    organizationId: v.string(),
    feature: v.union(v.literal("projects"), v.literal("teamMembers")),
    amount: v.optional(v.number()),
  },
  handler: async (
    ctx,
    args
  ): Promise<OrganizationLimitsResponse<OrganizationLimitsData>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      getIdentityOrThrow(identity);

      const existingLimits = await ctx.db
        .query("organizationLimits")
        .withIndex("by_organizationId", (q) =>
          q.eq("organizationId", args.organizationId)
        )
        .first();

      if (!existingLimits) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: "Organization limits not found",
        });
      }

      const amount = args.amount ?? 1;
      const updateField =
        `${args.feature}Current` as keyof typeof existingLimits;
      const currentValue = (existingLimits[updateField] as number) ?? 0;

      await ctx.db.patch(existingLimits._id, {
        [updateField]: currentValue + amount,
        updatedAt: Date.now(),
      });

      const updatedLimits = await ctx.db.get(existingLimits._id);

      if (!updatedLimits) {
        throw new ConvexError({
          code: "UPDATE_FAILED",
          message: "Failed to update organization limits",
        });
      }

      return { data: updatedLimits };
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

// Increment period-based usage
export const incrementPeriodUsage = mutation({
  args: {
    organizationId: v.string(),
    feature: v.union(),
    amount: v.optional(v.number()),
  },
  handler: async (
    ctx,
    args
  ): Promise<OrganizationLimitsResponse<OrganizationLimitsData>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      getIdentityOrThrow(identity);

      const existingLimits = await ctx.db
        .query("organizationLimits")
        .withIndex("by_organizationId", (q) =>
          q.eq("organizationId", args.organizationId)
        )
        .first();

      if (!existingLimits) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: "Organization limits not found",
        });
      }

      const amount = args.amount ?? 1;
      const updateField =
        `${args.feature}UsedThisPeriod` as keyof typeof existingLimits;
      const currentValue = (existingLimits[updateField] as number) ?? 0;

      await ctx.db.patch(existingLimits._id, {
        [updateField]: currentValue + amount,
        updatedAt: Date.now(),
      });

      const updatedLimits = await ctx.db.get(existingLimits._id);

      if (!updatedLimits) {
        throw new ConvexError({
          code: "UPDATE_FAILED",
          message: "Failed to update organization limits",
        });
      }

      return { data: updatedLimits };
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

// Update storage usage
export const updateStorageUsage = mutation({
  args: {
    organizationId: v.string(),
    bytesChange: v.number(), // Can be positive or negative
  },
  handler: async (
    ctx,
    args
  ): Promise<OrganizationLimitsResponse<OrganizationLimitsData>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      getIdentityOrThrow(identity);

      const existingLimits = await ctx.db
        .query("organizationLimits")
        .withIndex("by_organizationId", (q) =>
          q.eq("organizationId", args.organizationId)
        )
        .first();

      if (!existingLimits) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: "Organization limits not found",
        });
      }

      const newStorageUsed = Math.max(
        0,
        (existingLimits.storageUsedBytes ?? 0) + args.bytesChange
      );

      await ctx.db.patch(existingLimits._id, {
        storageUsedBytes: newStorageUsed,
        updatedAt: Date.now(),
      });

      const updatedLimits = await ctx.db.get(existingLimits._id);

      if (!updatedLimits) {
        throw new ConvexError({
          code: "UPDATE_FAILED",
          message: "Failed to update organization limits",
        });
      }

      return { data: updatedLimits };
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
