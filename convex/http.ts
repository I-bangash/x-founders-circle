import { WebhookEvent } from "@clerk/nextjs/server";
import { httpRouter } from "convex/server";
import { Resend as ResendAPI } from "resend";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { UserNotificationEmail } from "./emails/templates/userNotificationEmail";

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
      const result: WebhookEvent = await ctx.runAction(
        internal.userFunctions.clerk.fulfill,
        {
          payload: payloadString,
          headers: {
            "svix-id": headerPayload.get("svix-id")!,
            "svix-timestamp": headerPayload.get("svix-timestamp")!,
            "svix-signature": headerPayload.get("svix-signature")!,
          },
        }
      );

      switch (result.type) {
        case "organizationMembership.updated":
        case "organizationMembership.created":
          await ctx.runMutation(
            internal.userFunctions.memberships.addUserIdToOrg,
            {
              userId: `https://${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
              orgId: result.data.organization.id,
            }
          );
          break;
        case "organizationMembership.deleted":
          await ctx.runMutation(
            internal.userFunctions.memberships.removeUserIdFromOrg,
            {
              userId: `https://${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
              orgId: result.data.organization.id,
            }
          );
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
    const requestBody = await request.text();

    try {
      const result = await ctx.runAction(
        internal.stripe.stripeActions.fulfill,
        {
          payload: requestBody,
          signature,
        }
      );

      return new Response(null, { status: 200 });
    } catch (error: any) {
      console.error(
        "[HTTP] Error processing Stripe webhook action:",
        error.message
      );
      const status =
        error.message.includes("Webhook Error") ||
        error.message.includes("Missing required data")
          ? 400
          : 500;
      return new Response(`Webhook Error: ${error.message}`, { status });
    }
  }),
});

http.route({
  path: "/email/send-user-notification",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { email, userName } = body;

      const appName = process.env.NEXT_PUBLIC_APP_NAME || "Your App";
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://example.com";

      if (!email) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const { data, error } = await resend.emails.send({
        from: "ViralLaunch <info@notifications.virallaunch.ai>",
        to: [email],
        replyTo: "izzybangash@gmail.com",
        subject: `Notification from ${appName}`,
        react: UserNotificationEmail({
          userName: userName || "there",
          appName,
          appUrl,
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
