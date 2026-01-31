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
    const fromEmail =
      process.env.EMAIL_FROM ||
      "ViralLaunch <info@notifications.virallaunch.ai>";
    const replyToEmail = process.env.EMAIL_REPLY_TO || "izzybangash@gmail.com";

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      replyTo: replyToEmail,
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
