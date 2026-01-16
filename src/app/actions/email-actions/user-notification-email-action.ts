"use server";

import { WinnerNotificationEmail } from "@/convex/emails/templates/WinnerNotificationEmail";
import { resend } from "@/libs/resend";

export async function sendUserNotificationEmailFunction({
  userName,
  email,
}: {
  userName: string;
  email: string;
}) {
  try {
    console.log(
      "[sendWinnerNotificationEmail] Starting to send email to:",
      email
    );

    const { data, error } = await resend.emails.send({
      from: "ViralLaunch <info@notifications.virallaunch.ai>",
      to: [email],
      replyTo: "izzybangash@gmail.com",
      subject: `🎉 Congratulations! You've Won ${giveawayName}!`,
      react: WinnerNotificationEmail({
        winnerName,
        giveawayName,
        totalPoints,
        referralPoints,
        winTimestamp,
      }),
    });

    if (error) {
      console.error(
        "[sendWinnerNotificationEmail] Error sending email:",
        error
      );
      return {
        success: false,
        error: `Failed to send winner notification email to ${email}: ${error.message}`,
      };
    }

    console.log("[sendWinnerNotificationEmail] Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("[sendWinnerNotificationEmail] Error:", error);
    return {
      success: false,
      error: `Failed to send winner notification email: ${error}`,
    };
  }
}
