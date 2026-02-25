"use server";

import { WelcomeEmail } from "@/convex/emails/templates/WelcomeEmail";
import { resend } from "@/libs/resend";

export async function sendWelcomeEmail({
  email,
  name,
}: {
  email: string;
  name?: string;
}) {
  try {
    const userName = name || "Founder";
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}`
      : "https://foundersonx.com";
    const loginUrl = `${baseUrl}/sign-in`;

    const { data, error } = await resend.emails.send({
      from: "FoundersonX <bangash@updates.foundersonx.com>",
      to: [email],
      replyTo: "izzybangash@gmail.com",
      subject: "You're in!",
      react: WelcomeEmail({ userName }),
      text: `Welcome to FoundersonX. Let's get to work.

You just joined something special.

I'm not going to lie - I get way too excited about every signup.

Right now I'm on my fourth coffee, doing a little victory dance that my neighbor definitely heard through the wall.

Here's the thing: You're not just another email in my database. You're a founder with something incredible to share. And most founders? They build amazing things that nobody ever discovers.

Not you. Not on my watch.

I built FoundersonX because I was sick of great products failing due to lack of visibility. You've got the hard part done - you built something people need. Now let's get them to see it.

Your mission: Take one, single action right now that will get you closer to your goal. Generate your first launch tweet. Find your ideal persona. Create a viral giveaway. Whatever. Let's just move.

Go Get Customer #1: ${loginUrl}

If you get stuck, hit reply to this email. It goes directly to me. Tell me what sucks, what you love, or if you just need a second opinion on a domain name. I read everything.

Time to make some noise,
Bangash`,
    });

    if (error) {
      console.error("[sendWelcomeEmail] Error sending email:", error);
      return { success: false, error: error.message };
    }

    console.log("[sendWelcomeEmail] Email sent successfully to:", email);
    return { success: true, data };
  } catch (error) {
    console.error("[sendWelcomeEmail] Catch Error:", error);
    return { success: false, error: "Failed to send welcome email" };
  }
}
