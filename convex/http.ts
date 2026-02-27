import type { WebhookEvent } from "@clerk/backend";
import { httpRouter } from "convex/server";
import { Resend as ResendAPI } from "resend";
import { Webhook } from "svix";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { UserNotificationEmail } from "./emails/templates/userNotificationEmail";

const resend = new ResendAPI(process.env.RESEND_API_KEY);

const http = httpRouter();

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET ?? "");
  try {
    return wh.verify(payloadString, svixHeaders) as WebhookEvent;
  } catch {
    return null;
  }
}

function stripeErrorStatus(message: string): number {
  return message.includes("Webhook Error") ||
    message.includes("Missing required data")
    ? 400
    : 500;
}

http.route({
  path: "/check",
  method: "GET",
  handler: httpAction(async (_ctx, _request) => {
    return new Response("OK", { status: 200 });
  }),
});

http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request);
    if (!event) {
      return new Response("Webhook verification failed", { status: 400 });
    }

    try {
      switch (event.type) {
        case "user.created": {
          const d = event.data;
          const primaryEmail = d.email_addresses?.[0];
          await ctx.runAction(internal.userFunctions.clerk.handleUserCreated, {
            clerkId: d.id,
            email: primaryEmail?.email_address,
            firstName: d.first_name ?? undefined,
            lastName: d.last_name ?? undefined,
            username:
              d.username ||
              primaryEmail?.email_address?.split("@")[0] ||
              undefined,
            imageUrl: d.image_url || undefined,
            emailVerified:
              primaryEmail?.verification?.status === "verified"
                ? Date.now()
                : undefined,
            inviteCode: d.unsafe_metadata?.inviteCode as string | undefined,
          });
          break;
        }
        case "user.updated": {
          const d = event.data;
          const primaryEmail = d.email_addresses?.[0];
          await ctx.runAction(internal.userFunctions.clerk.handleUserUpdated, {
            clerkId: d.id,
            email: primaryEmail?.email_address,
            firstName: d.first_name ?? undefined,
            lastName: d.last_name ?? undefined,
            username:
              d.username ||
              primaryEmail?.email_address?.split("@")[0] ||
              undefined,
            imageUrl: d.image_url || undefined,
            emailVerified:
              primaryEmail?.verification?.status === "verified"
                ? Date.now()
                : undefined,
          });
          break;
        }
        case "user.deleted": {
          const id = event.data.id!;
          await ctx.runAction(internal.userFunctions.clerk.handleUserDeleted, {
            clerkId: id,
          });
          break;
        }
        case "organization.created": {
          const d = event.data;
          await ctx.runAction(
            internal.userFunctions.clerk.handleOrganizationCreated,
            {
              orgId: d.id,
              name: d.name,
              createdBy: d.created_by!,
              imageUrl: d.image_url || undefined,
            }
          );
          break;
        }
        case "organization.updated": {
          const d = event.data;
          await ctx.runAction(
            internal.userFunctions.clerk.handleOrganizationUpdated,
            {
              orgId: d.id,
              name: d.name,
              imageUrl: d.image_url || undefined,
            }
          );
          break;
        }
        case "organizationMembership.created": {
          const d = event.data;
          await ctx.runAction(
            internal.userFunctions.clerk.handleOrganizationMembershipCreated,
            {
              userId: d.public_user_data.user_id,
              orgId: d.organization.id,
            }
          );
          break;
        }
        default: {
          console.log("[CLERK_WEBHOOK] Unhandled event type:", event.type);
        }
      }

      return new Response(null, { status: 200 });
    } catch (err) {
      console.error(`[CLERK_WEBHOOK] Error processing ${event.type}:`, err);
      return new Response("Internal Server Error", { status: 500 });
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
      await ctx.runAction(internal.stripe.stripeActions.fulfill, {
        payload: requestBody,
        signature,
      });
      return new Response(null, { status: 200 });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[HTTP] Error processing Stripe webhook:", message);
      return new Response(`Webhook Error: ${message}`, {
        status: stripeErrorStatus(message),
      });
    }
  }),
});

http.route({
  path: "/email/send-user-notification",
  method: "POST",
  handler: httpAction(async (_ctx, request) => {
    const body = await request.json();
    const { email, userName } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const appName = process.env.NEXT_PUBLIC_APP_NAME || "Your App";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://example.com";

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
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to send email: ${error.message}`,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
