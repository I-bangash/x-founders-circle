import { v } from "convex/values";

import { internal } from "../_generated/api";
import { internalMutation, mutation, query } from "../_generated/server";
import { getIdentityOrThrow } from "../helper/convexHelperFunctions";

function generateRandomCode(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const generateInviteCodes = mutation({
  args: {},
  handler: async (ctx) => {
    // We only generate codes for dummy users (imported members) that don't have one yet.
    const dummyUsersToUpdate = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.eq(q.field("inviteCode"), undefined),
          q.neq(q.field("twitterId"), undefined)
        )
      )
      .collect();

    // The filter above catches all imported users. But just to be safe,
    // let's only strictly add invite codes to members who have essentially a dummy email or clerkId
    // or who haven't claimed their profile.
    let updatedCount = 0;
    for (const user of dummyUsersToUpdate) {
      if (user.clerkId?.startsWith("dummy_")) {
        const uniqueCode = generateRandomCode();
        await ctx.db.patch(user._id, {
          inviteCode: uniqueCode,
        });
        updatedCount++;
      }
    }

    return { success: true, count: updatedCount };
  },
});

export const validateInviteCode = query({
  args: { inviteCode: v.string() },
  handler: async (ctx, args) => {
    const defaultPlan = await ctx.db
      .query("plans")
      .withIndex("by_lookup_key", (q) => q.eq("lookupKey", "free_trial"))
      .first();

    const dummyUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("inviteCode"), args.inviteCode.toUpperCase()))
      .first();

    if (!dummyUser) {
      return { valid: false, message: "Invalid invite code." };
    }

    if (!dummyUser.clerkId?.startsWith("dummy_")) {
      return { valid: false, message: "Invite code already claimed." };
    }

    return { valid: true, user: dummyUser };
  },
});

export const claimProfileInternal = internalMutation({
  args: { inviteCode: v.string(), clerkId: v.string() },
  handler: async (ctx, args) => {
    const { clerkId } = args;

    const currentUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), clerkId))
      .first();

    if (!currentUser) {
      return {
        success: false,
        retry: true,
        message: "Syncing user profile...",
      };
    }

    // Check if this clerk user has already claimed a profile
    if (currentUser.twitterId) {
      return { success: false, message: "Profile already claimed." };
    }

    // Find the dummy user by code
    const dummyUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("inviteCode"), args.inviteCode.toUpperCase()))
      .first();

    if (!dummyUser || !dummyUser.clerkId?.startsWith("dummy_")) {
      return { success: false, message: "Invalid or consumed invite code." };
    }

    // 1. Transfer stats to current user
    await ctx.db.patch(currentUser._id, {
      twitterId: dummyUser.twitterId,
      twitterUsername: dummyUser.twitterUsername,
      twitterName: dummyUser.twitterName,
      followersCount: dummyUser.followersCount,
      joinedAt: dummyUser.joinedAt,
      totalEngagements: dummyUser.totalEngagements,
      pointsUsed: dummyUser.pointsUsed,
      // Prioritize dummy user's details for display over Clerk defaults
      image: dummyUser.image || currentUser.image,
      name: dummyUser.twitterName || dummyUser.name || currentUser.name,
      firstname:
        currentUser.firstname || dummyUser.twitterName || dummyUser.name,
      lastname: currentUser.lastname || "",
      username:
        dummyUser.twitterUsername || dummyUser.username || currentUser.username,
    });

    // 2. Re-assign engagements to the new user ID if necessary?
    // In our schema, engagements are linked via `twitterUserId` strings.
    // Since we copied the `twitterId` string over to the real user, engagements
    // remain perfectly valid and naturally belong to the real user now!

    // 3. Delete the dummy profile
    // Make sure we aren't deleting engagements though!
    await ctx.db.delete(dummyUser._id);

    // 4. Create proper Clerk Organization for this user automatically
    await ctx.scheduler.runAfter(
      0,
      internal.userFunctions.clerk.createOrganizationAction,
      {
        clerkId,
        name:
          dummyUser.twitterName ||
          dummyUser.name ||
          dummyUser.username ||
          "Founder",
      }
    );

    // 5. Sync the Twitter profile image to Clerk
    if (dummyUser.image) {
      await ctx.scheduler.runAfter(
        0,
        internal.userFunctions.clerk.updateClerkProfileImageAction,
        { clerkId, imageUrl: dummyUser.image }
      );
    }

    return { success: true };
  },
});
