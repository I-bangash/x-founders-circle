/**
 * ============================================================================
 *                         PLAN CONFIGURATION
 * ============================================================================
 * This file is the Source of Truth for your application's billing structure.
 * It defines what plans are available, their prices, and their feature limits.
 *
 * HOW IT WORKS:
 * 1. Define your limits in the `limits` object (Optional, but recommended for reuse).
 * 2. Define your plans in the `planDefinitions` array.
 * 3. Run `npm run sync-plans` to automatically:
 *    - Create/Update these prices in Stripe.
 *    - Sync the resulting Price IDs to your SaaS database (Convex).
 */

const GB_TO_BYTES = 1024 * 1024 * 1024;

// 1. Define Reusable Limits (Optional)
//    Helpful if multiple tiers share similar limits (e.g. Monthly vs Yearly)
const limits = {
  free: {
    projects: 1,
    teamMembers: 1,
    storageGB: 0.1,
    features: ["1 Active Project", "100MB Storage", "Community Support"],
  },
  pro: {
    projects: 5,
    teamMembers: 3,
    storageGB: 10,
    features: [
      "5 Active Projects",
      "10GB Storage",
      "Priority Support",
      "Remove Branding",
    ],
  },
  agency: {
    projects: -1, // Unlimited
    teamMembers: 10,
    storageGB: 100,
    features: [
      "Unlimited Projects",
      "100GB Storage",
      "Dedicated Account Manager",
      "White Labeling",
    ],
  },
};

// 2. Define Plans
export const planDefinitions = [
  // --- FREE PLAN ---
  {
    name: "Free Trial",
    planType: "monthly" as const,
    lookupKey: "free_trial", // Must be unique
    stripePriceId: null, // Left null intentionally; not used for free plans
    stripeLTDPriceId: null,

    // Billing Details
    targetPrice: 0,
    initialPrice: 0,
    currency: "usd",
    isActive: true,

    // Limits & Features
    monthlyCreditsLimit: 50, // Dummy Data
    projectsLimit: limits.free.projects,
    teamMembersLimit: limits.free.teamMembers,
    storageLimitBytes: limits.free.storageGB * GB_TO_BYTES,
    features: limits.free.features,

    // UI Config
    isFeatured: false,
    order: 0,

    // Specific App Limits (Add your custom limits here)
    // aiCredits: 10,
    // videoRenders: 1,
  },

  // --- MONTHLY PLANS ---
  {
    name: "Pro Monthly",
    planType: "monthly" as const,
    lookupKey: "pro_monthly",
    stripePriceId: null, // Will be auto-filled in DB by sync script
    stripeLTDPriceId: null,

    targetPrice: 29, // $29 / month
    initialPrice: 49, // Dummy Data: Was $49
    currency: "usd",
    isActive: true,

    monthlyCreditsLimit: 1000, // Dummy Data
    projectsLimit: limits.pro.projects,
    teamMembersLimit: limits.pro.teamMembers,
    storageLimitBytes: limits.pro.storageGB * GB_TO_BYTES,
    features: limits.pro.features,

    isFeatured: true,
    order: 1,
  },

  // --- YEARLY PLANS ---
  {
    name: "Pro Yearly",
    planType: "monthly" as const,
    lookupKey: "pro_yearly", // Use "_yearly" in key to auto-set Stripe interval to 'year'
    stripePriceId: null,
    stripeLTDPriceId: null,

    targetPrice: 290, // $290 / year (2 months free)
    initialPrice: 490, // Dummy Data
    currency: "usd",
    isActive: true,

    // Inherit same limits as Pro Monthly
    monthlyCreditsLimit: 1000, // Dummy Data
    projectsLimit: limits.pro.projects,
    teamMembersLimit: limits.pro.teamMembers,
    storageLimitBytes: limits.pro.storageGB * GB_TO_BYTES,
    features: limits.pro.features,

    isFeatured: false,
    order: 2,
  },

  // --- LIFETIME DEALS (LTD) ---
  {
    name: "Agency Lifetime",
    planType: "ltd" as const,
    lookupKey: "agency_ltd",
    stripePriceId: null,
    stripeLTDPriceId: null,

    ltdPrice: 499, // One-time payment
    initialPrice: 999, // Dummy Data
    currency: "usd",
    isActive: true,

    monthlyCreditsLimit: 5000, // Dummy Data
    projectsLimit: limits.agency.projects,
    teamMembersLimit: limits.agency.teamMembers,
    storageLimitBytes: limits.agency.storageGB * GB_TO_BYTES,
    features: limits.agency.features,

    isFeatured: false,
    order: 3,

    // LTD Specifics
    ltdCampaignIdentifier: "EARLY_ADOPTER_2025",
    stackLevel: 3,
    ltdPurchaseCodeRequired: true, // If using redemption codes
  },
];

export type PlanDefinition = (typeof planDefinitions)[0];
