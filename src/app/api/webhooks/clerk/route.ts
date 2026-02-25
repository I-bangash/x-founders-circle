import { headers } from "next/headers";

import { WebhookEvent } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { Webhook } from "svix";

import { sendWelcomeEmail } from "@/app/actions/email-actions/welcome-email-action";
import { api, internal } from "@/convex/_generated/api";
import { TRIAL_DURATION_MS } from "@/utils/constants";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.log("[WEBHOOK] Missing webhook secret");
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env");
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.log("[WEBHOOK] Missing svix headers");
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  console.log("[WEBHOOK] Received payload:", {
    eventType: payload.type,
    data: payload.data,
  });

  const body = JSON.stringify(payload);

  // Verify the webhook
  let evt: WebhookEvent;
  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("[WEBHOOK] Verification failed:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    console.log("[USER.CREATED] Creating new user:", {
      userId: payload.data.id,
    });

    // if user id is user_2rfFgTNPDKE9fhRMpMX9AlMGiLz then return success
    if (payload.data.id === "user_2rfFgTNPDKE9fhRMpMX9AlMGiLz") {
      return new Response("Success", { status: 200 });
    }

    try {
      const userResult = await fetchMutation(
        api.userFunctions.users.createUserInternal,
        {
          clerkId: payload.data.id,
          firstname: payload.data.first_name || undefined,
          lastname: payload.data.last_name || undefined,
          name: payload.data.first_name
            ? `${payload.data.first_name} ${payload.data.last_name || ""}`
            : undefined,
          email: payload.data.email_addresses[0]?.email_address || undefined,
          emailVerified: payload.data.email_addresses[0]?.verified
            ? Date.now()
            : undefined,
          image: payload.data.image_url || undefined,
          username:
            payload.data.username ||
            payload.data.email_addresses[0]?.email_address?.split("@")[0] ||
            undefined,
        }
      );

      // Get user details for the email
      const userEmail = payload.data.email_addresses[0]?.email_address;
      const userName = payload.data.first_name || "Founder";

      // After the user is created successfully in Convex, trigger the email
      if (userResult.data && userEmail) {
        // Send the welcome email
        await sendWelcomeEmail({
          email: userEmail,
          name: userName,
        });
      } else if (userResult.error) {
        console.error("[USER.CREATED] Error creating user:", userResult.error);
        throw new Error(userResult.error.message);
      } else {
        console.warn(
          "[USER.CREATED] User created but could not send welcome email: Missing email or user data."
        );
      }

      console.log("[USER.CREATED] Created user successfully");
    } catch (error) {
      console.error("[USER.CREATED] Error:", error);
      return new Response("Error occurred", { status: 500 });
    }
  }

  if (eventType === "organization.created") {
    const now = Date.now();
    const trialEndDate = now + TRIAL_DURATION_MS; // Calculate end date

    console.log("[ORG.CREATED] Creating new organization:", {
      orgId: payload.data.id,
      createdBy: payload.data.created_by,
    });

    try {
      // --- Find Default Plan ---
      // Using lookupKey is more robust than assuming the first plan
      // TODO: use a free plan
      const trialPlanLookupKey = "free_trial"; // Must match plansData.ts
      const trialPlanResult = await fetchQuery(api., {
        lookupKey: trialPlanLookupKey,
      });

      if (trialPlanResult.error || !trialPlanResult.data) {
        console.error(
          "[ORG.CREATED] Free Trial plan not found! Cannot initialize org.",
          trialPlanResult.error
        );
        throw new Error(`Free Trial plan (${trialPlanLookupKey}) not found.`);
      }
      const trialPlan = trialPlanResult.data;
      // --- End Find Free Trial Plan ---

      // Create organization using Convex
      const organizationResult = await fetchMutation(
        api.userFunctions.organizations.createOrganizationInternal,
        {
          orgId: payload.data.id,
          userId: payload.data.created_by,
          name: payload.data.name,
          image: payload.data.image_url || undefined,
          planId: trialPlan._id, // Assign the TRIAL plan ID
          lifetimeAccess: false, // Default for new org
          activeLtdCampaign: undefined,
          totalStacksRedeemed: 0,
          isOnTrial: true, // Set trial flag
          trialEndDate: trialEndDate, // Set expiry date
        }
      );

      if (organizationResult.error) {
        throw new Error(organizationResult.error.message);
      }

      // Create organization limits (Populate ALL limits from defaultPlan)
      const limitsCreationResult = await fetchMutation(
        api.userFunctions.organizationLimits.createOrganizationLimitsInternal, // Use the existing mutation
        {
          organizationId: payload.data.id,
          planId: trialPlan._id, // Store planId in limits too
          planType: trialPlan.planType, // Store planType
          monthlyCreditsUsed: 0,
          monthlyCreditsLimit: trialPlan.monthlyCreditsLimit, // Copy from plan
          extraCredits: 0, // Start with 0 extra
          lastUsageReset: Date.now(), // Set initial reset time
          projectsCurrent: 0, // Start at 0 projects
          projectsLimit: trialPlan.projectsLimit, // Copy from plan
          teamMembersCurrent: 1, // Creator counts as 1
          teamMembersLimit: trialPlan.teamMembersLimit, // Copy from plan
          storageUsedBytes: 0,
          storageLimitBytes: trialPlan.storageLimitBytes, // Copy from plan
        }
      );

      if (limitsCreationResult.error) {
        console.error(
          "[ORG.CREATED] Error creating organization limits:",
          limitsCreationResult.error
        );
        // TODO: log this issue
      }

      console.log("[ORG.CREATED] Created organization limits successfully");

      // Update user's organization
      await fetchMutation(api.userFunctions.users.updateUser, {
        userId: payload.data.created_by,
        organizationId: payload.data.id,
      });
    } catch (error) {
      console.error("[ORG.CREATED] Error:", error);
      return new Response("Error occurred", { status: 500 });
    }
  }

  if (eventType === "organization.updated") {
    try {
      await fetchMutation(
        api.userFunctions.organizations.updateOrganization,
        {
          organizationId: payload.data.id,
          name: payload.data.name,
          image: payload.data.image_url || undefined,
        }
      );

      console.log("[ORG.UPDATED] Updated organization details");
    } catch (error) {
      console.error("[ORG.UPDATED] Error:", error);
    }
  }

  if (eventType === "organizationMembership.created") {
    // --- Limit Check ---
    // Fetch token for the *creating user* or use an internal API key if needed
    // This check is tricky in webhooks. Often done on the UI side before inviting.
    // If checking here, need a secure way to get token or use internal auth bypass.
    // For simplicity, we'll assume check happened before invite, and just update usage.
    // const limitCheckResult = await fetchQuery(api.limits.checkLimitAndCreditsQuery, {
    //      organizationId: membershipOrgId,
    //      feature: "teamMembers",
    // });
    // if (!limitCheckResult?.data?.allow) {
    //      console.warn(`Team member limit reached for org ${membershipOrgId}. Membership created by Clerk, but limit exceeded.`);
    //      // Log this potential issue
    // }
    // --- End Limit Check ---

    // When a user is added to an organization
    await fetchMutation(api.userFunctions.users.updateUser, {
      userId: payload.data.public_user_data.user_id,
      organizationId: payload.data.organization.id,
    });

    // --- Increment Usage Count ---
    const usageUpdateResult = await fetchMutation(
      api.userFunctions.organizationLimits.incrementUsage,
      {
        organizationId: payload.data.organization.id,
        feature: "teamMembers",
        amount: 1,
      }
    );
    if (usageUpdateResult.error) {
      console.error(
        `Failed to increment team member count for org ${payload.data.organization.id}:`,
        usageUpdateResult.error
      );
    }
    // --- End Increment Usage ---
  }

  if (eventType === "user.updated") {
    // Update user in database
    await fetchMutation(api.userFunctions.users.updateUser, {
      userId: payload.data.id,
      name: payload.data.first_name
        ? `${payload.data.first_name} ${payload.data.last_name || ""}`
        : undefined,
        firstName: payload.data.first_name || undefined,
        lastName: payload.data.last_name || undefined,
      email: payload.data.email_addresses[0]?.email_address || undefined,
      emailVerified: payload.data.email_addresses[0]?.verified
        ? Date.now()
        : undefined,
      image: payload.data.image_url || undefined,
      username:
        payload.data.username ||
        payload.data.email_addresses[0]?.email_address?.split("@")[0] ||
        undefined,
    });
  }

  if (eventType === "user.deleted") {
    // Delete user from database

    try {
      // --- Decrement Usage Count ---
      const usageUpdateResult = await fetchMutation(
        api.userFunctions.organizationLimits.incrementUsage,
        {
          organizationId: payload.data.organization.id,
          feature: "teamMembers",
          amount: -1, // Decrement
        }
      );
      if (usageUpdateResult.error) {
        console.error(
          `Failed to decrement team member count for org ${payload.data.organization.id}:`,
          usageUpdateResult.error
        );
      }
      // --- End Decrement Usage ---
      await fetchMutation(api.userFunctions.users.deleteUser, {
        userId: payload.data.id,
      });
    } catch (error) {
      console.error("[ORG.MEMBERSHIP.DELETED] Error:", error);
    }
  }

  return new Response("", { status: 200 });
}
