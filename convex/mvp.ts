import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

const POINTS = { comment: 1, like: 0.25, retweet: 5, bookmark: 3 } as const;
type EngagementType = keyof typeof POINTS;

function utcDateStr(ts: number) {
  return new Date(ts).toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function utcWeekStr(ts: number) {
  const d = new Date(ts);
  const dayOfWeek = d.getUTCDay();
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() - ((dayOfWeek + 6) % 7));
  return monday.toISOString().slice(0, 10); // "YYYY-MM-DD" of that week's Monday
}

function utcMonthStr(ts: number) {
  return new Date(ts).toISOString().slice(0, 7); // "YYYY-MM"
}

export const getMembers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("twitterId"), undefined))
      .collect();
  },
});

export const addMember = mutation({
  args: {
    twitterId: v.string(),
    twitterUsername: v.string(),
    name: v.string(),
    profileImageUrl: v.string(),
    followersCount: v.number(),
    joinedAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if member already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_twitterId", (q) => q.eq("twitterId", args.twitterId))
      .first();

    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        twitterUsername: args.twitterUsername,
        twitterName: args.name,
        username: args.twitterUsername,
        name: args.name,
        image: args.profileImageUrl,
        followersCount: args.followersCount,
      });
      return existing;
    }

    // Insert new dummy user for member tracking
    // For MVP, we use dummy email/clerkId if missing, or we simply insert what's needed for users.
    // The schema requires email, clerkId so we will put dummy values for this admin-added member
    const newUserId = await ctx.db.insert("users", {
      name: args.name,
      twitterName: args.name,
      twitterId: args.twitterId,
      twitterUsername: args.twitterUsername,
      username: args.twitterUsername,
      followersCount: args.followersCount,
      joinedAt: args.joinedAt,
      image: args.profileImageUrl,
      email: `dummy_${args.twitterId}@founderx.com`, // dummy
      clerkId: `dummy_${args.twitterId}`, // dummy
      totalEngagements: 0,
    });

    return await ctx.db.get(newUserId);
  },
});

export const getMemberByTwitterUsername = query({
  args: { twitterUsername: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_twitterUsername", (q) =>
        q.eq("twitterUsername", args.twitterUsername)
      )
      .first();
  },
});

export const deleteMember = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const member = await ctx.db.get(args.id);
    if (!member) return;

    // Delete associated engagements based on twitterId
    if (member.twitterId) {
      const engagements = await ctx.db
        .query("engagements")
        .withIndex("by_twitterUserId", (q) =>
          q.eq("twitterUserId", member.twitterId!)
        )
        .collect();
      for (const engagement of engagements) {
        await ctx.db.delete(engagement._id);
      }
    }

    await ctx.db.delete(args.id);
  },
});

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
    // Exclude queued posts — only show published or legacy admin-added posts
    return posts.filter((p) => p.status !== "queued");
  },
});

import { paginationOptsValidator } from "convex/server";

export const getPostsPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("posts")
      .withIndex("by_createdAt")
      .order("desc")
      // Filter out queued posts
      .filter((q) => q.neq(q.field("status"), "queued"))
      .paginate(args.paginationOpts);

    return results;
  },
});

export const addPost = mutation({
  args: {
    tweetId: v.string(),
    authorTwitterId: v.string(),
    authorUsername: v.string(),
    authorName: v.string(),
    authorAvatar: v.string(),
    content: v.string(),
    createdAt: v.number(),
    fetchedAt: v.number(),
    threadData: v.optional(v.any()), // parsed threads
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("posts")
      .withIndex("by_tweetId", (q) => q.eq("tweetId", args.tweetId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        threadData: args.threadData,
        fetchedAt: args.fetchedAt,
      });
      return existing._id;
    }

    return await ctx.db.insert("posts", { ...args, engagementCount: 0 });
  },
});

export const deletePost = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    // Delete associated engagements
    const engagements = await ctx.db
      .query("engagements")
      .withIndex("by_postId", (q) => q.eq("postId", args.id))
      .collect();

    for (const engagement of engagements) {
      await ctx.db.delete(engagement._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const getEngagements = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("engagements").collect();
  },
});

export const addEngagements = mutation({
  args: {
    engagements: v.array(
      v.object({
        postId: v.id("posts"),
        twitterUserId: v.string(),
        engagedAt: v.number(),
        engagementType: v.optional(
          v.union(
            v.literal("comment"),
            v.literal("like"),
            v.literal("retweet"),
            v.literal("bookmark")
          )
        ),
        pointsEarned: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    let addedCount = 0;
    for (const eng of args.engagements) {
      const existing = await ctx.db
        .query("engagements")
        .withIndex("by_postId_twitterUserId", (q) =>
          q.eq("postId", eng.postId).eq("twitterUserId", eng.twitterUserId)
        )
        .first();

      if (existing) continue;

      const type: EngagementType = eng.engagementType ?? "comment";
      const points = eng.pointsEarned ?? POINTS[type];

      await ctx.db.insert("engagements", {
        ...eng,
        engagementType: type,
        pointsEarned: points,
      });
      addedCount++;

      const user = await ctx.db
        .query("users")
        .withIndex("by_twitterId", (q) => q.eq("twitterId", eng.twitterUserId))
        .first();

      if (user) {
        const now = eng.engagedAt;
        const todayStr = utcDateStr(now);
        const weekStr = utcWeekStr(now);
        const monthStr = utcMonthStr(now);

        await ctx.db.patch(user._id, {
          totalEngagements: (user.totalEngagements || 0) + points,
          engagementsToday:
            user.lastEngagementDate === todayStr
              ? (user.engagementsToday || 0) + points
              : points,
          lastEngagementDate: todayStr,
          engagementsThisWeek:
            user.lastEngagementWeek === weekStr
              ? (user.engagementsThisWeek || 0) + points
              : points,
          lastEngagementWeek: weekStr,
          engagementsThisMonth:
            user.lastEngagementMonth === monthStr
              ? (user.engagementsThisMonth || 0) + points
              : points,
          lastEngagementMonth: monthStr,
        });
      }

      const post = await ctx.db.get(eng.postId);
      if (post) {
        await ctx.db.patch(eng.postId, {
          engagementCount: (post.engagementCount || 0) + points,
        });
      }
    }
    return addedCount;
  },
});

export const getPostByTweetId = query({
  args: { tweetId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_tweetId", (q) => q.eq("tweetId", args.tweetId))
      .first();
  },
});

export const addManualEngagements = mutation({
  args: {
    twitterUsername: v.string(),
    tweetIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Find user (case-insensitive fallback)
    const users = await ctx.db.query("users").collect();
    const user = users.find(
      (u) =>
        u.twitterUsername?.toLowerCase() ===
          args.twitterUsername.toLowerCase() ||
        u.username?.toLowerCase() === args.twitterUsername.toLowerCase()
    );

    if (!user || !user.twitterId) {
      throw new Error("User not found or missing twitterId");
    }

    let addedCount = 0;
    for (const tweetId of args.tweetIds) {
      const post = await ctx.db
        .query("posts")
        .withIndex("by_tweetId", (q) => q.eq("tweetId", tweetId.trim()))
        .first();

      if (!post) continue;

      const existing = await ctx.db
        .query("engagements")
        .withIndex("by_postId_twitterUserId", (q) =>
          q.eq("postId", post._id).eq("twitterUserId", user.twitterId!)
        )
        .first();

      if (!existing) {
        const now = Date.now();
        const points = POINTS.comment;
        const todayStr = utcDateStr(now);
        const weekStr = utcWeekStr(now);
        const monthStr = utcMonthStr(now);

        await ctx.db.insert("engagements", {
          postId: post._id,
          twitterUserId: user.twitterId,
          engagedAt: now,
          engagementType: "comment",
          pointsEarned: points,
        });
        addedCount++;

        await ctx.db.patch(post._id, {
          engagementCount: (post.engagementCount || 0) + points,
        });

        await ctx.db.patch(user._id, {
          totalEngagements: (user.totalEngagements || 0) + points,
          engagementsToday:
            user.lastEngagementDate === todayStr
              ? (user.engagementsToday || 0) + points
              : points,
          lastEngagementDate: todayStr,
          engagementsThisWeek:
            user.lastEngagementWeek === weekStr
              ? (user.engagementsThisWeek || 0) + points
              : points,
          lastEngagementWeek: weekStr,
          engagementsThisMonth:
            user.lastEngagementMonth === monthStr
              ? (user.engagementsThisMonth || 0) + points
              : points,
          lastEngagementMonth: monthStr,
        });
      }
    }
    return addedCount;
  },
});

export const removeManualEngagements = mutation({
  args: {
    twitterUsername: v.string(),
    tweetIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Find user (case-insensitive fallback)
    const users = await ctx.db.query("users").collect();
    const user = users.find(
      (u) =>
        u.twitterUsername?.toLowerCase() ===
          args.twitterUsername.toLowerCase() ||
        u.username?.toLowerCase() === args.twitterUsername.toLowerCase()
    );

    if (!user || !user.twitterId) {
      throw new Error("User not found or missing twitterId");
    }

    let removedCount = 0;
    for (const tweetId of args.tweetIds) {
      const post = await ctx.db
        .query("posts")
        .withIndex("by_tweetId", (q) => q.eq("tweetId", tweetId.trim()))
        .first();

      if (!post) continue;

      const existing = await ctx.db
        .query("engagements")
        .withIndex("by_postId_twitterUserId", (q) =>
          q.eq("postId", post._id).eq("twitterUserId", user.twitterId!)
        )
        .first();

      if (existing) {
        const points = existing.pointsEarned ?? POINTS.comment;
        await ctx.db.delete(existing._id);
        removedCount++;

        await ctx.db.patch(post._id, {
          engagementCount: Math.max(0, (post.engagementCount || 0) - points),
        });

        await ctx.db.patch(user._id, {
          totalEngagements: Math.max(0, (user.totalEngagements || 0) - points),
        });
      }
    }
    return removedCount;
  },
});

export const migrateTwitterNames = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let count = 0;

    for (const user of users) {
      if (user.twitterId && user.name && user.twitterName === undefined) {
        await ctx.db.patch(user._id, {
          twitterName: user.name,
        });
        count++;
      }
    }

    return { success: true, migratedCount: count };
  },
});

// ─── Self-reported engagement mutations ────────────────────────────────────

type EngagementResponse<T> = {
  data?: T;
  error?: { code: string; message: string };
};

export const toggleSelfEngagement = mutation({
  args: {
    postId: v.id("posts"),
    engagementType: v.union(
      v.literal("comment"),
      v.literal("like"),
      v.literal("retweet"),
      v.literal("bookmark")
    ),
  },
  handler: async (
    ctx,
    { postId, engagementType }
  ): Promise<EngagementResponse<{ added: boolean; pointsDelta: number }>> => {
    // 1. Auth
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        error: {
          code: "NOT_AUTHENTICATED",
          message: "You must be logged in to mark engagements.",
        },
      };
    }
    const clerkId = identity.subject;

    // 2. Resolve calling user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      return {
        error: { code: "NOT_FOUND", message: "User record not found." },
      };
    }
    if (!user.twitterId) {
      return {
        error: {
          code: "TWITTER_NOT_LINKED",
          message: "Link your Twitter account before marking engagements.",
        },
      };
    }

    // 3. Check post exists
    const post = await ctx.db.get(postId);
    if (!post) {
      return { error: { code: "NOT_FOUND", message: "Post not found." } };
    }

    // 4. Prevent self-engagement (can't mark your own post)
    if (post.authorTwitterId === user.twitterId) {
      return {
        error: {
          code: "INVALID_OPERATION",
          message: "You cannot mark engagements on your own post.",
        },
      };
    }

    // 5. Check for existing engagement of this specific type
    const existing = await ctx.db
      .query("engagements")
      .withIndex("by_postId_twitterUserId_type", (q) =>
        q
          .eq("postId", postId)
          .eq("twitterUserId", user.twitterId!)
          .eq("engagementType", engagementType)
      )
      .first();

    const points = POINTS[engagementType];
    const now = Date.now();

    if (existing) {
      // ── Remove engagement ──
      const earnedPoints = existing.pointsEarned ?? points;
      await ctx.db.delete(existing._id);

      await ctx.db.patch(post._id, {
        engagementCount: Math.max(0, (post.engagementCount || 0) - earnedPoints),
      });

      await ctx.db.patch(user._id, {
        totalEngagements: Math.max(0, (user.totalEngagements || 0) - earnedPoints),
      });

      return { data: { added: false, pointsDelta: -earnedPoints } };
    } else {
      // ── Add engagement ──
      const todayStr = utcDateStr(now);
      const weekStr = utcWeekStr(now);
      const monthStr = utcMonthStr(now);

      await ctx.db.insert("engagements", {
        postId,
        twitterUserId: user.twitterId!,
        engagedAt: now,
        engagementType,
        pointsEarned: points,
      });

      await ctx.db.patch(post._id, {
        engagementCount: (post.engagementCount || 0) + points,
      });

      await ctx.db.patch(user._id, {
        totalEngagements: (user.totalEngagements || 0) + points,
        engagementsToday:
          user.lastEngagementDate === todayStr
            ? (user.engagementsToday || 0) + points
            : points,
        lastEngagementDate: todayStr,
        engagementsThisWeek:
          user.lastEngagementWeek === weekStr
            ? (user.engagementsThisWeek || 0) + points
            : points,
        lastEngagementWeek: weekStr,
        engagementsThisMonth:
          user.lastEngagementMonth === monthStr
            ? (user.engagementsThisMonth || 0) + points
            : points,
        lastEngagementMonth: monthStr,
      });

      return { data: { added: true, pointsDelta: points } };
    }
  },
});

/** Returns the engagement types the calling user has self-marked on a single post. */
export const getMyEngagementsForPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }): Promise<string[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const clerkId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();
    if (!user?.twitterId) return [];

    const engagements = await ctx.db
      .query("engagements")
      .withIndex("by_postId_twitterUserId", (q) =>
        q.eq("postId", postId).eq("twitterUserId", user.twitterId!)
      )
      .collect();

    return engagements.flatMap((e) =>
      e.engagementType !== undefined ? [e.engagementType] : []
    );
  },
});

/** Batch: returns a map of { [postId]: engagementType[] } for the calling user. */
export const getMyEngagementsForPosts = query({
  args: { postIds: v.array(v.id("posts")) },
  handler: async (ctx, { postIds }): Promise<Record<string, string[]>> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || postIds.length === 0) return {};
    const clerkId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();
    if (!user?.twitterId) return {};

    // Fetch all self-marked engagements for this user in one go
    const myEngagements = await ctx.db
      .query("engagements")
      .withIndex("by_twitterUserId", (q) =>
        q.eq("twitterUserId", user.twitterId!)
      )
      .collect();

    const postIdSet = new Set(postIds as string[]);
    const result: Record<string, string[]> = {};

    for (const eng of myEngagements) {
      const pid = eng.postId as string;
      if (!postIdSet.has(pid) || !eng.engagementType) continue;
      if (!result[pid]) result[pid] = [];
      result[pid].push(eng.engagementType);
    }

    return result;
  },
});
