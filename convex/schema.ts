import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { paymentAttemptSchemaValidator } from "./stripe/paymentAttemptTypes";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    // this the Clerk ID, stored in the subject JWT field
    externalId: v.string(),
  }).index("byExternalId", ["externalId"]),

  paymentAttempts: defineTable(paymentAttemptSchemaValidator)
    .index("byPaymentId", ["payment_id"])
    .index("byUserId", ["userId"])
    .index("byPayerUserId", ["payer.user_id"]),

  plans: defineTable({
    // --- Identity ---
    name: v.string(),
    planType: v.string(), // "monthly" | "ltd"
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
