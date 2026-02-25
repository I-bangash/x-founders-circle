import { headers } from "next/headers";

import type {
  OrganizationJSON,
  OrganizationMembershipJSON,
  UserDeletedJSON,
  UserJSON,
} from "@clerk/backend";
import { WebhookEvent } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { Webhook } from "svix";

import { sendWelcomeEmail } from "@/app/actions/email-actions/welcome-email-action";
import { api } from "@/convex/_generated/api";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;
  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("[WEBHOOK] Verification failed:", err);
    return new Response("Verification failed", { status: 400 });
  }

  try {
    await processWebhookEvent(evt);
    return new Response("Success", { status: 200 });
  } catch (err) {
    console.error(`[WEBHOOK] Error processing ${evt.type}:`, err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

async function processWebhookEvent(evt: WebhookEvent) {
  switch (evt.type) {
    case "user.created":
    case "user.updated":
      if (evt.type === "user.created") {
        await handleUserCreated(evt.data);
      } else {
        await handleUserUpdated(evt.data);
      }
      break;
    case "user.deleted":
      await handleUserDeleted(evt.data);
      break;
    case "organization.created":
    case "organization.updated":
      if (evt.type === "organization.created") {
        await handleOrganizationCreated(evt.data);
      } else {
        await handleOrganizationUpdated(evt.data);
      }
      break;
    case "organizationMembership.created":
      await handleOrganizationMembershipCreated(evt.data);
      break;
    default:
      break;
  }
}

async function handleUserCreated(data: UserJSON) {
  if (data.id === "user_2rfFgTNPDKE9fhRMpMX9AlMGiLz") {
    return;
  }

  const primaryEmail = data.email_addresses?.[0];
  const emailVerified =
    primaryEmail?.verification?.status === "verified" ? Date.now() : undefined;
  const username =
    data.username || primaryEmail?.email_address?.split("@")[0] || undefined;
  const name = data.first_name
    ? `${data.first_name} ${data.last_name ?? ""}`.trim()
    : undefined;

  const userResult = await fetchMutation(
    api.userFunctions.users.createUserInternal,
    {
      clerkId: data.id,
      firstname: data.first_name ?? undefined,
      lastname: data.last_name ?? undefined,
      name,
      email: primaryEmail?.email_address ?? undefined,
      emailVerified,
      image: data.image_url || undefined,
      username,
    }
  );

  const userEmail = primaryEmail?.email_address;
  const userName = data.first_name ?? "Founder";

  if (userResult.data && userEmail) {
    await sendWelcomeEmail({ email: userEmail, name: userName });
  } else if (userResult.error) {
    console.error("[USER.CREATED] Error creating user:", userResult.error);
    throw new Error(userResult.error.message);
  }
}

async function handleUserUpdated(data: UserJSON) {
  const primaryEmail = data.email_addresses?.[0];
  const emailVerified =
    primaryEmail?.verification?.status === "verified" ? Date.now() : undefined;
  const username =
    data.username || primaryEmail?.email_address?.split("@")[0] || undefined;
  const name = data.first_name
    ? `${data.first_name} ${data.last_name ?? ""}`.trim()
    : undefined;

  await fetchMutation(api.userFunctions.users.updateUser, {
    userId: data.id,
    name,
    firstName: data.first_name ?? undefined,
    lastName: data.last_name ?? undefined,
    email: primaryEmail?.email_address ?? undefined,
    emailVerified,
    image: data.image_url || undefined,
    username,
  });
}

async function handleUserDeleted(data: UserDeletedJSON) {
  if (!data.id) return;

  await fetchMutation(api.userFunctions.users.deleteUser, {
    userId: data.id,
  });
}

async function handleOrganizationCreated(data: OrganizationJSON) {
  const defaultPlanLookupKey = "free_trial";
  const defaultPlanResult = await fetchQuery(
    api.stripe.billing.getPlanByLookupKey,
    { lookupKey: defaultPlanLookupKey }
  );

  if (!defaultPlanResult) {
    console.error("[ORG.CREATED] Default plan not found");
    throw new Error(`Default plan (${defaultPlanLookupKey}) not found`);
  }

  const organizationResult = await fetchMutation(
    api.userFunctions.organizations.createOrganizationInternal,
    {
      orgId: data.id,
      userId: data.created_by!,
      name: data.name,
      image: data.image_url || undefined,
      planId: defaultPlanResult._id,
      lifetimeAccess: false,
      activeLtdCampaign: undefined,
      totalStacksRedeemed: 0,
      isOnTrial: false,
    }
  );

  if (organizationResult.error) {
    throw new Error(organizationResult.error.message);
  }

  const limitsCreationResult = await fetchMutation(
    api.userFunctions.organizationLimits.createOrganizationLimitsInternal,
    {
      organizationId: data.id,
      planId: defaultPlanResult._id,
      planType: defaultPlanResult.planType,
      monthlyCreditsUsed: 0,
      monthlyCreditsLimit: defaultPlanResult.monthlyCreditsLimit ?? 0,
      extraCredits: 0,
      lastUsageReset: Date.now(),
      projectsCurrent: 0,
      projectsLimit: defaultPlanResult.projectsLimit ?? 0,
      teamMembersCurrent: 1,
      teamMembersLimit: defaultPlanResult.teamMembersLimit ?? 0,
      storageUsedBytes: 0,
      storageLimitBytes: defaultPlanResult.storageLimitBytes ?? 0,
    }
  );

  if (limitsCreationResult.error) {
    console.error(
      "[ORG.CREATED] Error creating organization limits:",
      limitsCreationResult.error
    );
  }

  await fetchMutation(api.userFunctions.users.updateUser, {
    userId: data.created_by!,
    organizationId: data.id,
  });
}

async function handleOrganizationUpdated(data: OrganizationJSON) {
  await fetchMutation(api.userFunctions.organizations.updateOrganization, {
    organizationId: data.id,
    name: data.name,
    image: data.image_url || undefined,
  });
}

async function handleOrganizationMembershipCreated(
  data: OrganizationMembershipJSON
) {
  await fetchMutation(api.userFunctions.users.updateUser, {
    userId: data.public_user_data.user_id,
    organizationId: data.organization.id,
  });

  const usageUpdateResult = await fetchMutation(
    api.userFunctions.organizationLimits.incrementUsage,
    {
      organizationId: data.organization.id,
      feature: "teamMembers",
      amount: 1,
    }
  );

  if (usageUpdateResult.error) {
    console.error(
      `[ORG.MEMBERSHIP.CREATED] Failed to increment team members for org ${data.organization.id}:`,
      usageUpdateResult.error
    );
  }
}
