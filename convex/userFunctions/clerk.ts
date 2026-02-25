"use node";

import { v } from "convex/values";
import { Resend } from "resend";

import { api, internal } from "../_generated/api";
import { internalAction } from "../_generated/server";
import { WelcomeEmail } from "../emails/templates/WelcomeEmail";

const ADMIN_USER_ID = "user_2rfFgTNPDKE9fhRMpMX9AlMGiLz";
const DEFAULT_PLAN_LOOKUP_KEY = "free_trial";

const EMAIL_FROM = "FoundersonX <bangash@updates.foundersonx.com>";
const EMAIL_REPLY_TO = "izzybangash@gmail.com";
const DEFAULT_APP_URL = "https://foundersonx.com";

function buildFullName(
  firstName?: string,
  lastName?: string
): string | undefined {
  if (!firstName) return undefined;
  return `${firstName} ${lastName ?? ""}`.trim();
}

export const handleUserCreated = internalAction({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    username: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    emailVerified: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.clerkId === ADMIN_USER_ID) return;

    const userResult = await ctx.runMutation(
      api.userFunctions.users.createUserInternal,
      {
        clerkId: args.clerkId,
        firstname: args.firstName,
        lastname: args.lastName,
        name: buildFullName(args.firstName, args.lastName),
        email: args.email ?? "",
        emailVerified: args.emailVerified,
        image: args.imageUrl,
        username: args.username,
      }
    );

    if (userResult.error) {
      throw new Error(userResult.error.message);
    }

    // if (userResult.data && args.email) {
    //   await ctx.runAction(internal.userFunctions.clerk.sendWelcomeEmailAction, {
    //     email: args.email,
    //     name: args.firstName ?? "Founder",
    //   });
    // }
  },
});

export const handleUserUpdated = internalAction({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    username: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    emailVerified: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(api.userFunctions.users.updateUserInternal, {
      userId: args.clerkId,
      name: buildFullName(args.firstName, args.lastName),
      firstname: args.firstName,
      lastname: args.lastName,
      email: args.email,
      emailVerified: args.emailVerified,
      image: args.imageUrl,
      username: args.username,
    });
  },
});

export const handleUserDeleted = internalAction({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    await ctx.runMutation(api.userFunctions.users.deleteUserInternal, {
      userId: clerkId,
    });
  },
});

export const handleOrganizationCreated = internalAction({
  args: {
    orgId: v.string(),
    name: v.string(),
    createdBy: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const defaultPlan = await ctx.runQuery(
      internal.stripe.billing.getPlanByLookupKeyInternal,
      { lookupKey: DEFAULT_PLAN_LOOKUP_KEY }
    );

    if (!defaultPlan) {
      throw new Error(`Default plan (${DEFAULT_PLAN_LOOKUP_KEY}) not found`);
    }

    const orgResult = await ctx.runMutation(
      api.userFunctions.organizations.createOrganizationInternal,
      {
        orgId: args.orgId,
        userId: args.createdBy,
        name: args.name,
        image: args.imageUrl,
        planId: defaultPlan._id,
        lifetimeAccess: false,
        totalStacksRedeemed: 0,
        isOnTrial: false,
      }
    );

    if (orgResult.error) {
      throw new Error(orgResult.error.message);
    }

    await ctx.runMutation(
      api.userFunctions.organizationLimits.createOrganizationLimitsInternal,
      {
        organizationId: args.orgId,
        planId: defaultPlan._id,
        planType: defaultPlan.planType,
        monthlyCreditsUsed: 0,
        monthlyCreditsLimit: defaultPlan.monthlyCreditsLimit ?? 0,
        extraCredits: 0,
        lastUsageReset: Date.now(),
        projectsCurrent: 0,
        projectsLimit: defaultPlan.projectsLimit ?? 0,
        teamMembersCurrent: 1,
        teamMembersLimit: defaultPlan.teamMembersLimit ?? 0,
        storageUsedBytes: 0,
        storageLimitBytes: defaultPlan.storageLimitBytes ?? 0,
      }
    );

    await ctx.runMutation(api.userFunctions.users.updateUserInternal, {
      userId: args.createdBy,
      organizationId: args.orgId,
    });
  },
});

export const handleOrganizationUpdated = internalAction({
  args: {
    orgId: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const result = await ctx.runMutation(
      internal.userFunctions.organizations.updateOrganizationWebhook,
      {
        organizationId: args.orgId,
        name: args.name,
        image: args.imageUrl,
      }
    );

    if (result.error) {
      throw new Error(result.error.message);
    }
  },
});

export const handleOrganizationMembershipCreated = internalAction({
  args: {
    userId: v.string(),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(api.userFunctions.users.updateUserInternal, {
      userId: args.userId,
      organizationId: args.orgId,
    });

    const usageResult = await ctx.runMutation(
      internal.userFunctions.organizationLimits.incrementUsageInternal,
      {
        organizationId: args.orgId,
        feature: "teamMembers",
        amount: 1,
      }
    );

    if (usageResult.error) {
      throw new Error(usageResult.error.message);
    }
  },
});

export const sendWelcomeEmailAction = internalAction({
  args: { email: v.string(), name: v.optional(v.string()) },
  handler: async (_ctx, { email, name }) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const userName = name ?? "Founder";
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_APP_URL;

    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [email],
      replyTo: EMAIL_REPLY_TO,
      subject: "You're in!",
      react: WelcomeEmail({ userName }),
      text: `Welcome to FoundersonX. Go get customer #1: ${baseUrl}/sign-in`,
    });

    if (error) {
      throw new Error(`Failed to send welcome email: ${error.message}`);
    }
  },
});
