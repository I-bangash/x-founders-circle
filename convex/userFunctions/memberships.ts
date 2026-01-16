import { ConvexError, v } from "convex/values";

import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  internalQuery,
  query,
} from "../_generated/server";

// Types for error handling
type MembershipResponse<T> = {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

export const hasOrgAccess = async (
  ctx: MutationCtx | QueryCtx,
  orgId: string
) => {
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

  // const userIdToken = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
  // console.log("[hasOrgAccess] userIdToken:", userIdToken);
  // // LOG] '[hasOrgAccess] userId:' 'https://possible-shrew-36.clerk.accounts.dev|user_2wo7skfcdurR0IG23G875G9DLYk'
  // // split userId by | and get the first part
  // const userIdParts = userIdToken?.split("|");
  // const userId = userIdParts?.[1];

  // console.log("[hasOrgAccess] userId:", userId);

  if (!userId) {
    return false;
  }

  const membership = await ctx.db
    .query("memberships")
    .withIndex("by_orgId_userId", (q) =>
      q.eq("orgId", orgId).eq("userId", userId)
    )
    .first();

  return !!membership;
};

export const addUserIdToOrg = internalMutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
  },
  async handler(ctx, args): Promise<MembershipResponse<boolean>> {
    try {
      const isExistingMember = await ctx.db
        .query("memberships")
        .withIndex("by_orgId_userId", (q) =>
          q.eq("orgId", args.orgId).eq("userId", args.userId)
        )
        .first();

      if (isExistingMember) {
        console.error(
          "User membership already exists with this workspace for user: ",
          args.userId
        );
        return {
          data: false,
          error: {
            code: "ALREADY_EXISTS",
            message: "User membership already exists with this workspace",
          },
        };
      }

      await ctx.db.insert("memberships", {
        orgId: args.orgId,
        userId: args.userId,
      });

      return { data: true };
    } catch (error) {
      console.error(
        "Error adding user to organization: ",
        error,
        args.userId,
        args.orgId
      );
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message:
            "An unexpected error occurred while adding user to organization",
        },
      };
    }
  },
});

export const removeUserIdFromOrg = internalMutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
  },
  async handler(ctx, args): Promise<MembershipResponse<boolean>> {
    try {
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_orgId_userId", (q) =>
          q.eq("orgId", args.orgId).eq("userId", args.userId)
        )
        .first();

      if (!membership) {
        console.error("Membership not found: ", args.userId, args.orgId);
        return {
          error: {
            code: "NOT_FOUND",
            message: "Membership not found",
          },
        };
      }

      await ctx.db.delete(membership._id);
      return { data: true };
    } catch (error) {
      console.error(
        "Error removing user from organization: ",
        error,
        args.userId,
        args.orgId
      );
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message:
            "An unexpected error occurred while removing user from organization",
        },
      };
    }
  },
});

export const hasOrgAccessQuery = internalQuery({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args): Promise<MembershipResponse<boolean>> {
    try {
      const hasAccess = await hasOrgAccess(ctx, args.orgId);
      return { data: hasAccess };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message:
            "An unexpected error occurred while checking organization access",
        },
      };
    }
  },
});

export const allOrgMembers = query({
  args: {},
  async handler(ctx): Promise<MembershipResponse<any[]>> {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity || !identity.tokenIdentifier) {
        return {
          error: {
            code: "NOT_AUTHENTICATED",
            message: "User not authenticated",
          },
        };
      }

      if (!identity.profileUrl) {
        return {
          error: {
            code: "NO_WORKSPACE",
            message: "User not attached to any workspace",
          },
        };
      }

      // const allOrgMembers = await ctx.db
      //   .query("memberships")
      //   .withIndex("by_orgId", (q) => q.eq("orgId", identity.profileUrl!))
      //   .collect();
      // if (!allOrgMembers) {
      //   return { data: [] };
      // }
      // const allUsers = await Promise.all(
      //   allOrgMembers.map(async (member) => {
      //     const teamMember = await ctx.db.query("users").unique();
      //     return teamMember;
      //   }),
      // );

      const allOrgMembers = await ctx.db
        .query("users")
        .withIndex("by_organizationId", (q) =>
          q.eq("organizationId", identity.profileUrl!)
        )
        .collect();

      return { data: allOrgMembers.filter(Boolean) };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return {
        error: {
          code: "INTERNAL_ERROR",
          message:
            "An unexpected error occurred while fetching organization members",
        },
      };
    }
  },
});
