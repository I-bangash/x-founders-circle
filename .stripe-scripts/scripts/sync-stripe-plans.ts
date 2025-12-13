import { execSync } from "child_process";
import dotenv from "dotenv";
import Stripe from "stripe";

import { planDefinitions } from "../../src/config/plansData";

// --- Configuration ---
dotenv.config({ path: ".env.local" });

// Convex Deployment URL - Prioritize env var
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error("❌ Error: STRIPE_SECRET_KEY is missing from .env.local");
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

/**
 * Main Sync Function
 */
async function syncPlans() {
  const isLive = STRIPE_SECRET_KEY!.startsWith("sk_live_");
  console.log(
    `\n🚀 Starting Unified Stripe Sync (${isLive ? "LIVE" : "TEST"} Mode)`
  );

  // --- Step 1: Stripe Product Setup ---
  const monthlyProductId = await getOrCreateProduct(
    "ViralLaunch Monthly Subscription"
  );
  const ltdProductId = await getOrCreateProduct("ViralLaunch Lifetime Deal");

  // --- Step 2: Stripe Price Creation & ID Collection ---
  console.log("\n💳 Syncing Prices with Stripe...");
  const priceMap: Record<string, string> = {};

  for (const plan of planDefinitions) {
    if (!plan) {
      console.warn(`   ⚠️  Skipping plan - Missing plan definition`);
      continue;
    }
    if (!plan.lookupKey) {
      console.warn(`   ⚠️  Skipping plan "${plan.name}" - Missing lookupKey`);
      continue;
    }

    // Determine purchase type
    const isMonthly = plan.planType === "monthly";
    const isPurchasableLTD =
      plan.planType === "ltd" && typeof plan.ltdPrice === "number";

    if (!isMonthly && !isPurchasableLTD) {
      console.log(`   ℹ️  Skipping Stripe Price for non-purchasable plan`);
      continue;
    }

    try {
      // Check existing
      const existing = await stripe.prices.list({
        lookup_keys: [plan.lookupKey],
        limit: 1,
        active: true,
      });

      let priceId = "";

      if (existing.data.length > 0) {
        priceId = existing.data[0].id;
        console.log(
          `   ✅ Found existing price for ${plan.lookupKey}: ${priceId}`
        );
      } else {
        // Create new
        const priceData: Stripe.PriceCreateParams = {
          product: isMonthly ? monthlyProductId : ltdProductId,
          currency: plan.currency || "usd",
          nickname: plan.name,
          lookup_key: plan.lookupKey,
          unit_amount: isMonthly
            ? Math.round((plan.targetPrice || 0) * 100)
            : Math.round((plan.ltdPrice || 0) * 100),
          active: true,
        };

        if (isMonthly) {
          priceData.recurring = {
            interval: plan.lookupKey.includes("_yearly_") ? "year" : "month",
          };
        }

        const newPrice = await stripe.prices.create(priceData);
        priceId = newPrice.id;
        console.log(
          `   ✨ Created NEW price for ${plan.lookupKey}: ${priceId}`
        );
      }

      priceMap[plan.lookupKey] = priceId;
    } catch (error: any) {
      console.error(
        `   ❌ Failed to process ${plan.lookupKey}:`,
        error.message
      );
    }
  }

  // --- Step 3: Convex Database Seeding (VIA CLI for Security) ---
  console.log("\n💾 Injecting Price IDs into Convex Database...");

  try {
    // We use `npx convex run` to execute the internal mutation with admin privileges.
    // We pass the price map as a JSON string argument.
    const args = JSON.stringify({ stripePriceMap: priceMap });

    console.log(`   💾 Injecting Price IDs into Convex Database: ${args}`);

    // Escape single quotes for shell safety if necessary (basic implementation)
    // A robust impl might write to a temporary file, but for simple JSON this usually works.
    // NOTE: In complex shells, argument passing can be brittle.
    // For a template, we assume standard JSON structure.

    // Construct command: npx convex run stripe/plans:seedPlans '{"stripePriceMap": {...}}'
    let command = `npx convex run stripe/plans:seedPlans '${args}'`;

    if (isLive) {
      console.log(
        "   🚀 Detected LIVE mode. Targeting Production Convex Deployment..."
      );
      command += " --prod";
    }

    console.log("   Running Convex Mutation via CLI...");
    execSync(command, { stdio: "inherit" }); // Inherit stdio to show Convex logs directly

    console.log("   ✅ Successfully seeded plans to Convex!");
  } catch (error: any) {
    console.error("   ❌ Convex Seeding Failed.");
    console.error(
      "      This script uses 'npx convex run' which requires you to be logged in."
    );
    console.error(
      "      Try running 'npx convex login' if this fails repeatedly."
    );
  }

  console.log("\n🏁 Sync Complete.\n");
}

// --- Helper: Get/Create Product ---
async function getOrCreateProduct(name: string): Promise<string> {
  const existing = await stripe.products.list({ active: true, limit: 100 });
  const product = existing.data.find((p) => p.name === name);

  if (product) return product.id;

  console.log(`   📦 Creating Product: ${name}`);
  const newProduct = await stripe.products.create({ name });
  return newProduct.id;
}

// --- Run ---
syncPlans().catch((e) => console.error(e));
