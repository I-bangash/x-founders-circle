"use server";

import { UserNotificationEmail } from "@/convex/emails/templates/userNotificationEmail";
import { resend } from "@/libs/resend";

export async function sendUserNotificationEmailFunction({
  userName,
  email,
}: {
  userName: string;
  email: string;
}) {
  try {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || "Your App";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://example.com";

    const { data, error } = await resend.emails.send({
      from: "ViralLaunch <info@notifications.virallaunch.ai>",
      to: [email],
      replyTo: "izzybangash@gmail.com",
      subject: `Notification from ${appName}`,
      react: UserNotificationEmail({
        userName,
        appName,
        appUrl,
      }),
    });

    if (error) {
      return {
        success: false,
        error: `Failed to send user notification email to ${email}: ${error.message}`,
      };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: `Failed to send user notification email: ${error}`,
    };
  }
}
