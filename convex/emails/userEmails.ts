import { ConvexError, v } from "convex/values";

import { sendUserNotificationEmailFunction } from "../../src/app/actions/email-actions/user-notification-email-action";
import { api } from "../_generated/api";
import { internalAction } from "../_generated/server";

export const sendUserNotificationEmail = internalAction({
  args: {
    userId: v.string(),
  },
  async handler(ctx, args) {
    try {
      const user = await ctx.runQuery(api.userFunctions.users.getUser, {
        userId: args.userId,
      });

      if (user?.error) {
        throw new ConvexError(user.error.message);
      }

      if (!user?.data) {
        throw new ConvexError("User not found");
      }

      if (!user.data.email) {
        throw new ConvexError("User email not found");
      }

      const response = await sendUserNotificationEmailFunction({
        userName: user?.data?.name || "there",
        email: user.data.email,
      });

      if (!response.success) {
        throw new ConvexError(response.error || "Failed to send email");
      }

      return { success: true };
    } catch (error) {
      throw new ConvexError(`Failed to send email: ${error}`);
    }
  },
});
