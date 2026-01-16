import { ConvexError, v } from "convex/values";
import { internalAction } from "../_generated/server";
import { resend } from "@/utils/resend";

export const sendReminderEmail = internalAction({
  args: {
    email: v.string(),
    projectName: v.optional(v.string()),
    planId: v.id("plans"),
  },
  async handler(ctx, args) {
    const { error } = await resend.emails.send({
      from: "ProjectPlannerAi <support@projectplannerai.com>",
      to: args.email,
      subject: `Your friendly reminder to work on ${args.projectName} - ProjectPlannerAI reminders!`,
      react: (
        <ReminderEmail
          projectName={args.projectName ?? args.planId}
          planId={args.planId}
        />
      ),
    });

    if (error) {
      console.error("Error inside reminder: ", error);
      throw new ConvexError(
        `Failed to send email to ${args.email} on plan ${args.planId}`,
      );
    }
  },
});
