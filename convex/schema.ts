import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  memberships: defineTable({
    orgId: v.string(),
    userId: v.string(),
  })
    .index("by_orgId", ["orgId"])
    .index("by_orgId_userId", ["orgId", "userId"]),

  projects: defineTable({
    orgId: v.string(),
    userId: v.string(),
    projectName: v.optional(v.string()),
  })
    .index("by_orgId", ["orgId"])
    .index("by_userId", ["userId"])
    .index("by_projectName", ["projectName"]),

  notifications: defineTable({
    userId: v.string(),
    orgId: v.string(),
    type: v.union(
      // Helps determine icon and potentially link behavior
      v.literal("task_processing"),
      v.literal("task_complete"),
      v.literal("task_error"),
      v.literal("general_info")
    ),
    title: v.string(), // Short title (e.g., "Render Complete", "Persona Ready")
    message: v.string(), // Detailed message or error info
    status: v.union(
      // For styling/icon purposes
      v.literal("success"),
      v.literal("error"),
      v.literal("info"),
      v.literal("processing")
    ),
    link: v.optional(v.string()), // Optional URL (e.g., download link, view link)
    metadata: v.optional(v.any()), // Store extra type-specific data if needed
    isRead: v.boolean(), // Default should be false
    readAt: v.optional(v.number()), // Timestamp when read
    updatedAt: v.optional(v.number()),
  })
    .index("by_userId_orgId_read", ["userId", "orgId", "isRead"]) // Index for fetching user/org notifications
    .index("by_orgId_read", ["orgId", "isRead"]) // Index for org-level notifications if needed
    .index("by_userId_read", ["userId", "isRead"]), // Index for sorting by read status and implicit creation time

  users: defineTable({
    name: v.optional(v.string()),
    firstname: v.optional(v.string()),
    lastname: v.optional(v.string()),
    clerkId: v.string(),
    username: v.optional(v.string()), // This could stay as the local user's handle if different from twitter
    email: v.string(),
    emailVerified: v.optional(v.number()), // timestamp stored as number in Convex
    image: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    hasOnboarded: v.optional(v.boolean()),

    // Appended MVP fields (from twitter)
    twitterId: v.optional(v.string()), // rest_id
    twitterUsername: v.optional(v.string()), // screen_name
    twitterName: v.optional(v.string()), // The actual twitter display name
    followersCount: v.optional(v.number()),
    joinedAt: v.optional(v.number()),
    totalEngagements: v.optional(v.number()),
    inviteCode: v.optional(v.string()), // Specific claim code for this user
  })
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"])
    .index("by_organizationId", ["organizationId"])
    .index("by_twitterId", ["twitterId"])
    .index("by_twitterUsername", ["twitterUsername"]),

  posts: defineTable({
    tweetId: v.string(),
    authorTwitterId: v.string(),
    authorUsername: v.string(),
    authorName: v.string(),
    authorAvatar: v.string(),
    content: v.string(),
    createdAt: v.number(),
    fetchedAt: v.number(),
    threadData: v.optional(v.any()), // Store the parsed thread structure
    engagementCount: v.optional(v.number()),
  })
    .index("by_tweetId", ["tweetId"])
    .index("by_createdAt", ["createdAt"]),

  engagements: defineTable({
    postId: v.id("posts"),
    twitterUserId: v.string(), // matches users.twitterId
    engagedAt: v.number(),
  })
    .index("by_postId", ["postId"])
    .index("by_twitterUserId", ["twitterUserId"])
    .index("by_postId_twitterUserId", ["postId", "twitterUserId"]),

  // Organizations table
  organizations: defineTable({
    name: v.optional(v.string()),
    orgId: v.string(),
    userId: v.string(),
    image: v.optional(v.string()),
    avatarName: v.optional(v.string()),
    avatarImage: v.optional(v.string()),
    planId: v.optional(v.id("plans")),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    stripeSubscriptionStatus: v.optional(v.string()),
    stripeCurrentPeriodEnd: v.optional(v.number()),
    lifetimeAccess: v.boolean(),
    activeLtdCampaign: v.optional(v.string()),
    totalStacksRedeemed: v.number(),
    ltdPurchaseDate: v.optional(v.number()),
    billingAnchorDay: v.optional(v.number()), // Day of the month (1-31)

    // --- New Trial Fields ---
    isOnTrial: v.boolean(), // Is the org currently on trial?
    trialEndDate: v.optional(v.number()), // Timestamp when the trial expires
    // --- End New Trial Fields ---
  })
    .index("by_orgId", ["orgId"])
    .index("by_userId", ["userId"])
    .index("by_planId", ["planId"])
    .index("by_stripeSubscriptionId", ["stripeSubscriptionId"])
    .index("by_stripeCustomerId", ["stripeCustomerId"]) // <<< Add if needed for webhook lookups
    .index("by_billingAnchorDay", ["billingAnchorDay"]),

  // OrganizationLimits table
  organizationLimits: defineTable({
    organizationId: v.string(),
    planId: v.id("plans"),
    planType: v.union(v.literal("monthly"), v.literal("ltd")),
    monthlyCreditsUsed: v.number(),
    monthlyCreditsLimit: v.number(),
    extraCredits: v.number(),
    lastUsageReset: v.number(),
    projectsCurrent: v.number(),
    projectsLimit: v.number(),
    teamMembersCurrent: v.number(),
    teamMembersLimit: v.number(),
    storageUsedBytes: v.number(),
    storageLimitBytes: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_planId", ["planId"]),

  ltdCodes: defineTable({
    code: v.string(),
    ltdCampaignIdentifier: v.string(),
    source: v.string(), // e.g., "AppSumo", "Direct"
    stackValue: v.number(), // Default: 1
    maxStacksPerOrg: v.number(), // Max codes from this campaign per org
    isRedeemed: v.boolean(), // Default: false
    redeemedByOrgId: v.optional(v.string()),
    redeemedAt: v.optional(v.number()),
    // createdAt: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_code", ["code"])
    .index("by_campaign", ["ltdCampaignIdentifier"]), // Useful for managing campaigns,

  redeemedLtdCodes: defineTable({
    organizationId: v.string(), // Org that redeemed
    ltdCodeId: v.id("ltdCodes"), // The specific code ID redeemed
    ltdCampaignIdentifier: v.string(), // Campaign identifier (copied)
    stackLevelAchieved: v.number(), // The total stack level the org reached *after* this redemption
    redeemedAt: v.number(), // Timestamp
  })
    .index("by_organizationId", ["organizationId"]) // To find all codes for an org
    .index("by_organizationId_campaign", [
      "organizationId",
      "ltdCampaignIdentifier",
    ])
    .index("by_code", ["ltdCodeId"]),

  plans: defineTable({
    // --- Identity ---
    name: v.string(),
    planType: v.union(v.literal("monthly"), v.literal("ltd")),
    lookupKey: v.string(), // Unique identifier from config

    // --- Stripe Identifiers ---
    stripePriceId: v.union(v.string(), v.null()),
    stripeLTDPriceId: v.union(v.string(), v.null()),

    // --- Billing Details ---
    currency: v.string(),
    isActive: v.boolean(),
    targetPrice: v.optional(v.number()),
    initialPrice: v.optional(v.number()),
    ltdPrice: v.optional(v.number()),

    // --- Limits & Features (Matches config/plansData.ts) ---
    projectsLimit: v.optional(v.number()),
    teamMembersLimit: v.optional(v.number()),
    storageLimitBytes: v.optional(v.number()),
    features: v.array(v.string()),

    // --- LTD Specifics ---
    ltdCampaignIdentifier: v.optional(v.string()),
    stackLevel: v.optional(v.number()),
    ltdPurchaseCodeRequired: v.optional(v.boolean()),

    // --- UI Config ---
    isFeatured: v.boolean(),
    order: v.number(),

    // --- App Specific Limits (Add your custom limits here) ---
    // These match the optional fields in the seed mutation
    monthlyCreditsLimit: v.optional(v.number()),
  })
    .index("by_lookup_key", ["lookupKey"])
    .index("by_stripe_price_id", ["stripePriceId"]),
});
