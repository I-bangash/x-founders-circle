import { v } from "convex/values";

import { planDefinitions } from "../../src/config/plansData";
import { Doc } from "../_generated/dataModel";
import { internalMutation } from "../_generated/server";

// Helper type for plan data stored in Convex
type PlanDocument = Doc<"plans">;

/**
 * Seed or Update Plans with Unified Stripe Sync
 *
 * This is an INTERNAL mutation. It cannot be called by public clients (browsers).
 * It is called via `npx convex run` in the sync script, which runs with admin privileges.
 */
export const seedPlans = internalMutation({
  args: {
    stripePriceMap: v.any(), // Record<string, string> - passed from the sync script
  },
  handler: async (ctx, args) => {
    const priceMap = args.stripePriceMap as Record<string, string>;
    console.log(
      `Starting plan seeding with ${Object.keys(priceMap).length} Stripe Prices provided.`
    );

    const results = { updated: 0, inserted: 0, errors: 0, skipped: 0 };

    for (const planDef of planDefinitions) {
      if (!planDef.lookupKey) {
        console.warn(`Skipping plan "${planDef.name}" - Missing lookupKey.`);
        results.errors++;
        continue;
      }

      // 1. Get Price ID from the provided map (Source of Truth)
      const providedPriceId = priceMap[planDef.lookupKey];

      // 2. Logic to determine if this plan *needs* a price
      const needsPrice =
        planDef.planType === "monthly" ||
        (planDef.planType === "ltd" && typeof planDef.ltdPrice === "number");

      if (needsPrice && !providedPriceId) {
        console.warn(
          `⚠️ Warning: Plan "${planDef.name}" (${planDef.lookupKey}) expects a Stripe Price but none was provided in the map.`
        );
        // potentially skip or continue with null
      }

      // 3. Prepare Data
      const finalPlanData = {
        name: planDef.name,
        planType: planDef.planType,
        lookupKey: planDef.lookupKey,
        // Assign price ID based on type
        stripePriceId: planDef.planType === "monthly" ? providedPriceId : null,
        stripeLTDPriceId: planDef.planType === "ltd" ? providedPriceId : null,

        ltdCampaignIdentifier: planDef.ltdCampaignIdentifier,
        stackLevel: planDef.stackLevel,
        ltdPurchaseCodeRequired: planDef.ltdPurchaseCodeRequired,
        isActive: planDef.isActive,
        isFeatured: planDef.isFeatured ?? false,
        targetPrice: planDef.targetPrice ?? undefined,
        initialPrice: planDef.initialPrice ?? undefined,
        ltdPrice: planDef.ltdPrice ?? undefined,
        currency: planDef.currency,
        monthlyCreditsLimit: planDef.monthlyCreditsLimit,
        projectsLimit: planDef.projectsLimit,
        teamMembersLimit: planDef.teamMembersLimit,
        storageLimitBytes: planDef.storageLimitBytes,
        features: planDef.features,
        order: planDef.order ?? 0,
      };

      // 4. Upsert into Database
      try {
        const existing = await ctx.db
          .query("plans")
          .withIndex("by_lookup_key", (q) =>
            q.eq("lookupKey", planDef.lookupKey)
          )
          .unique();

        if (existing) {
          // Verify if patch is needed? For now, we always patch to ensure consistency
          const patchData: any = { ...finalPlanData };
          delete patchData.lookupKey; // Don't patch the key itself

          await ctx.db.patch(existing._id, patchData);
          results.updated++;
        } else {
          await ctx.db.insert("plans", finalPlanData as any);
          results.inserted++;
        }
      } catch (dbError: any) {
        console.error(
          `Database error processing plan ${planDef.name}:`,
          dbError.message
        );
        results.errors++;
      }
    }

    console.log(
      `Seeding Complete: Inserted: ${results.inserted}, Updated: ${results.updated}, Errors: ${results.errors}`
    );
    return results;
  },
});
