import { cronJobs } from "convex/server";

import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

const crons = cronJobs();

// ─── Auto-publish queued posts at midday UTC ──────────────────

export const publishQueuedPosts = internalMutation({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().slice(0, 10);

    const queued = await ctx.db
      .query("posts")
      .withIndex("by_status", (q) => q.eq("status", "queued"))
      .filter((q) => q.eq(q.field("dailyDate"), today))
      .collect();

    let published = 0;

    for (const post of queued) {
      // Check if this author already has a published post today
      const alreadyPublished = await ctx.db
        .query("posts")
        .withIndex("by_authorTwitterId_dailyDate", (q) =>
          q.eq("authorTwitterId", post.authorTwitterId).eq("dailyDate", today)
        )
        .filter((q) => q.eq(q.field("status"), "published"))
        .first();

      if (!alreadyPublished) {
        await ctx.db.patch(post._id, { status: "published" });
        published++;
      }
    }

    console.log(`[cron] publishQueuedPosts: ${published} posts published`);
  },
});

crons.daily(
  "publish-queued-posts",
  { hourUTC: 12, minuteUTC: 0 },
  internal.crons.publishQueuedPosts
);

export default crons;
