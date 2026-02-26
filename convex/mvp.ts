import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

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
      .order("desc") // default behavior but good to specify conceptually
      .collect();
    // In convex, 'desc' sorting on index is done via .order("desc").
    return posts;
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

      if (!existing) {
        await ctx.db.insert("engagements", eng);
        addedCount++;

        // Update user's total engagements
        const user = await ctx.db
          .query("users")
          .withIndex("by_twitterId", (q) =>
            q.eq("twitterId", eng.twitterUserId)
          )
          .first();
        if (user) {
          await ctx.db.patch(user._id, {
            totalEngagements: (user.totalEngagements || 0) + 1,
          });
        }

        // Update post's engagement count
        const post = await ctx.db.get(eng.postId);
        if (post) {
          await ctx.db.patch(eng.postId, {
            engagementCount: (post.engagementCount || 0) + 1,
          });
        }
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
