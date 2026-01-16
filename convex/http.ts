import { WebhookEvent } from "@clerk/nextjs/server";
import { httpRouter } from "convex/server";
import { Resend as ResendAPI } from "resend";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { WinnerNotificationEmail } from "./emails/templates/WinnerNotificationEmail";

const resend = new ResendAPI(process.env.RESEND_API_KEY);

const http = httpRouter();

http.route({
  path: "/check",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    return new Response("WHATTTSSS UPPPY!", {
      status: 200,
    });
  }),
});

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;

    try {
      const result: WebhookEvent = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      console.log("result.type in addUserIdToOrg", result.type);

      switch (result.type) {
        case "organizationMembership.updated":
        case "organizationMembership.created":
          await ctx.runMutation(internal.memberships.addUserIdToOrg, {
            userId: `https://${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
            orgId: result.data.organization.id,
          });
          break;
        case "organizationMembership.deleted":
          await ctx.runMutation(internal.memberships.removeUserIdFromOrg, {
            userId: `https://${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
            orgId: result.data.organization.id,
          });
          break;
      }

      return new Response(null, {
        status: 200,
      });
    } catch (err) {
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});

http.route({
  path: "/stripe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get("stripe-signature") as string;
    // Read body once for verification AND passing to action
    const requestBody = await request.text();

    console.log("[HTTP] Stripe webhook received..."); // Log receipt

    try {
      // Call the internal action to handle verification and processing
      const result = await ctx.runAction(internal.stripeActions.fulfill, {
        // Ensure correct path
        payload: requestBody,
        signature,
      });

      // The action now throws on verification/processing error
      console.log("[HTTP] Stripe action successful.");
      return new Response(null, { status: 200 }); // Success
    } catch (error: any) {
      // Catch errors thrown by the action (verification or mutation errors)
      console.error(
        "[HTTP] Error processing Stripe webhook action:",
        error.message
      );
      // Return 400 for client-like errors (bad signature, missing data), 500 for internal server errors
      const status =
        error.message.includes("Webhook Error") ||
        error.message.includes("Missing required data")
          ? 400
          : 500;
      return new Response(`Webhook Error: ${error.message}`, { status });
    }
  }),
});

// Add a new route for sending winner notification emails
http.route({
  path: "/email/send-winner-notification",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const {
        email,
        winnerName,
        giveawayName,
        rank,
        totalPoints,
        referralPoints,
        winTimestamp,
        winnerId,
      } = body;

      console.log("[HTTP] Sending winner notification email to:", email);

      // Validate required fields
      if (!email || !giveawayName) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Send the email using Resend
      const { data, error } = await resend.emails.send({
        from: "ViralLaunch <info@notifications.virallaunch.ai>",
        to: [email],
        replyTo: "izzybangash@gmail.com",
        subject: `🎉 Congratulations! You've Won - ${giveawayName}!`,
        react: WinnerNotificationEmail({
          winnerName,
          giveawayName,
          totalPoints,
          referralPoints,
          winTimestamp,
        }),
      });

      if (error) {
        console.error("[HTTP] Error sending email:", error);
        return new Response(
          JSON.stringify({
            success: false,
            error: `Failed to send email: ${error.message}`,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      console.log("[HTTP] Email sent successfully:", data);

      // If winnerId is provided, mark the email as sent
      // if (winnerId) {
      //   await ctx.runMutation(internal.giveawayWinners.markWinnerEmailSent, {
      //     winnerId,
      //   });
      //   console.log("[HTTP] Winner email marked as sent");
      // }

      return new Response(JSON.stringify({ success: true, data }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("[HTTP] Error in email endpoint:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Server error: ${error}`,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }),
});

export default http;
