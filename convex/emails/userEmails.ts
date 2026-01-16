import { ConvexError, v } from "convex/values";

import { sendUserNotificationEmailFunction } from "../../src/app/actions/email-actions/user-notification-email-action";
import { api } from "../_generated/api";
import { internalAction } from "../_generated/server";

export const sendUserNotificationEmail = internalAction({
  args: {
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    try {
      // Get winner details
      const user = await ctx.runQuery(api.users.getUserById, {
        userId: args.userId,
      });

      if (user?.error) {
        throw new ConvexError(user.error.message);
      }

      if (!user?.data) {
        console.log("[sendUserNotificationEmail] User not found");
        throw new ConvexError("User not found");
      }

      const response = await sendUserNotificationEmailFunction({
        userName: user?.data?.name || "Winner",
        email: user?.data?.email,
      });

      if (!response.success) {
        throw new ConvexError(response.error || "Failed to send email");
      }

      return { success: true };
    } catch (error) {
      console.log(`[sendWinnerNotificationEmail] Error: ${error}`);
      throw new ConvexError(`Failed to send email: ${error}`);
    }
  },
});
