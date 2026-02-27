import { ConvexError, v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import {
  ConvexErrorType,
  getIdentityOrThrow,
} from "./helper/convexHelperFunctions";

type DashboardResponse<T> = {
  data?: T;
  error?: { code: string; message: string };
};

// ─── Helpers ─────────────────────────────────────────────────

function utcDateString(timestamp?: number): string {
  const d = timestamp ? new Date(timestamp) : new Date();
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// ─── Queries ──────────────────────────────────────────────────

export const getCurrentUser = query({
  args: {},
  handler: async (ctx): Promise<DashboardResponse<any>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return { data: null };

      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
        .first();

      return { data: user ?? null };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return { error: { code: "INTERNAL_ERROR", message: "Unexpected error" } };
    }
  },
});

export const getMyPosts = query({
  args: {},
  handler: async (ctx): Promise<DashboardResponse<any[]>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return { data: [] };

      const clerkId = identity.subject;
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
        .first();

      if (!user?.twitterId) return { data: [] };

      // Posts may have authorTwitterId as numeric ID or username — match both
      const [byId, byUsername] = await Promise.all([
        ctx.db
          .query("posts")
          .withIndex("by_authorTwitterId_createdAt", (q) =>
            q.eq("authorTwitterId", user.twitterId!)
          )
          .order("desc")
          .collect(),
        user.twitterUsername
          ? ctx.db
              .query("posts")
              .withIndex("by_authorTwitterId_createdAt", (q) =>
                q.eq("authorTwitterId", user.twitterUsername!)
              )
              .order("desc")
              .collect()
          : [],
      ]);

      // Deduplicate by _id, latest first
      const seen = new Set<string>();
      const posts = [...byId, ...byUsername]
        .filter((p) => {
          if (seen.has(p._id)) return false;
          seen.add(p._id);
          return true;
        })
        .sort((a, b) => b.createdAt - a.createdAt);

      return { data: posts };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return { error: { code: "INTERNAL_ERROR", message: "Unexpected error" } };
    }
  },
});

export const getMyChartData = query({
  args: { days: v.optional(v.number()) },
  handler: async (
    ctx,
    { days = 90 }
  ): Promise<
    DashboardResponse<
      { date: string; postsShared: number; engagementReceived: number }[]
    >
  > => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return { data: [] };

      const clerkId = identity.subject;
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
        .first();

      if (!user?.twitterId) return { data: [] };

      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

      // Match by both numeric twitterId and username (admin posts use username)
      const [byId, byUsername] = await Promise.all([
        ctx.db
          .query("posts")
          .withIndex("by_authorTwitterId_createdAt", (q) =>
            q.eq("authorTwitterId", user.twitterId!).gte("createdAt", cutoff)
          )
          .collect(),
        user.twitterUsername
          ? ctx.db
              .query("posts")
              .withIndex("by_authorTwitterId_createdAt", (q) =>
                q
                  .eq("authorTwitterId", user.twitterUsername!)
                  .gte("createdAt", cutoff)
              )
              .collect()
          : [],
      ]);

      const seen = new Set<string>();
      const myPosts = [...byId, ...byUsername].filter((p) => {
        if (seen.has(p._id)) return false;
        seen.add(p._id);
        return true;
      });

      const byDate: Record<
        string,
        { postsShared: number; engagementReceived: number }
      > = {};
      for (const post of myPosts) {
        const date = utcDateString(post.createdAt);
        if (!byDate[date])
          byDate[date] = { postsShared: 0, engagementReceived: 0 };
        byDate[date].postsShared += 1;
        byDate[date].engagementReceived += post.engagementCount ?? 0;
      }

      const result = Object.keys(byDate)
        .sort()
        .map((date) => ({ date, ...byDate[date] }));

      return { data: result };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return { error: { code: "INTERNAL_ERROR", message: "Unexpected error" } };
    }
  },
});

// ─── Mutations ────────────────────────────────────────────────

export const setPostStatus = mutation({
  args: {
    tweetId: v.string(),
  },
  handler: async (
    ctx,
    { tweetId }
  ): Promise<DashboardResponse<{ status: string; tweetId: string }>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        return {
          error: {
            code: "NOT_AUTHENTICATED",
            message: "You must be logged in",
          },
        };
      }

      const clerkId = identity.subject;
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
        .first();

      if (!user) {
        return { error: { code: "NOT_FOUND", message: "User not found" } };
      }
      if (!user.twitterId) {
        return {
          error: {
            code: "INVALID_OPERATION",
            message: "Link your Twitter account before sharing posts",
          },
        };
      }

      const post = await ctx.db
        .query("posts")
        .withIndex("by_tweetId", (q) => q.eq("tweetId", tweetId))
        .first();

      if (!post) {
        return { error: { code: "NOT_FOUND", message: "Post not found" } };
      }

      // authorTwitterId may be stored as numeric twitterId OR as username
      const isAuthor =
        post.authorTwitterId === user.twitterId ||
        post.authorTwitterId === user.twitterUsername ||
        post.authorTwitterId === user.username;

      if (!isAuthor) {
        return {
          error: {
            code: "UNAUTHORIZED",
            message: "This post does not belong to your Twitter account",
          },
        };
      }

      const today = utcDateString();

      // Check if user already has a published/queued post today
      const existingToday = await ctx.db
        .query("posts")
        .withIndex("by_authorTwitterId_dailyDate", (q) =>
          q.eq("authorTwitterId", user.twitterId!).eq("dailyDate", today)
        )
        .filter((q) => q.neq(q.field("_id"), post._id))
        .first();

      const status = existingToday ? "queued" : "published";

      await ctx.db.patch(post._id, {
        status,
        sharedByClerkId: clerkId,
        dailyDate: today,
      });

      return { data: { status, tweetId } };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return { error: { code: "INTERNAL_ERROR", message: "Unexpected error" } };
    }
  },
});

export const deleteMyPost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }): Promise<DashboardResponse<boolean>> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        return {
          error: {
            code: "NOT_AUTHENTICATED",
            message: "You must be logged in",
          },
        };
      }

      const clerkId = identity.subject;
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
        .first();

      if (!user) {
        return { error: { code: "NOT_FOUND", message: "User not found" } };
      }

      const post = await ctx.db.get(postId);
      if (!post) {
        return { error: { code: "NOT_FOUND", message: "Post not found" } };
      }

      // Auth: must be the uploader OR the twitter author (by ID or username)
      const isUploader = post.sharedByClerkId === clerkId;
      const isAuthor =
        post.authorTwitterId === user.twitterId ||
        post.authorTwitterId === user.twitterUsername ||
        post.authorTwitterId === user.username;

      if (!isUploader && !isAuthor) {
        return {
          error: {
            code: "UNAUTHORIZED",
            message: "You can only delete your own posts",
          },
        };
      }

      // Delete engagements first
      const engagements = await ctx.db
        .query("engagements")
        .withIndex("by_postId", (q) => q.eq("postId", postId))
        .collect();

      for (const eng of engagements) {
        await ctx.db.delete(eng._id);
      }

      await ctx.db.delete(postId);
      return { data: true };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: error.data as { code: string; message: string } };
      }
      return { error: { code: "INTERNAL_ERROR", message: "Unexpected error" } };
    }
  },
});
