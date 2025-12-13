# Unified Stripe & Convex Sync

This folder contains a modern, production-ready implementation for syncing Stripe Plans with a Convex backend.

## Architecture

1.  **Config First**: Plans are defined in `src/config/plansData.ts`.
2.  **Sync Script**: `scripts/sync-stripe-plans.ts` runs locally.
    - It ensures Stripe Products and Prices exist for every plan.
    - It captures the live Price IDs.
    - It **immediately** calls a Convex Mutation to seed these IDs into the database.
3.  **Convex Source of Truth**: The `plans` table in Convex is populated directly, bypassing the need for `SP_...` env vars.

## Integration Instructions

To use this in your project (or a new template):

### 1. Copy Files

- Copy `.stripe/config/plansData.ts` to `src/config/plansData.ts`.
  - _Customize this file with your own pricing tiers and limits._
- Create the folder `convex/stripe/`.
- Copy `.stripe/convex/stripe/plans.ts` to `convex/stripe/plans.ts`.
  - _Note: Ensure you have `planDefinitions` available in your Convex scope (imported from `../../config/plansData`)._
- Copy `.stripe/scripts/sync-stripe-plans.ts` to `scripts/sync-stripe-plans.ts`.

### 2. Update `convex/schema.ts`

- Open `.stripe/convex/schema.ts` and copy the `plans` table definition.
- Paste it into your existing `convex/schema.ts` file inside `defineSchema({ ... })`.

### 3. Update `convex/_generated/api.d.ts`

- Run `npx convex dev` or `npx convex codegen` to generate the types for the new `seedPlans` mutation.

### 3. Add Script to package.json

Add the following helper script to your `package.json`:

```json
"scripts": {
  "sync-plans": "tsx .stripe-scripts/scripts/sync-stripe-plans.ts"
}
```

_(Ensure you have `tsx` installed: `npm i -D tsx`)_

### 4. Run the Sync

**Prerequisite:**
You must be logged into the Convex CLI for this script to work (it uses `npx convex run`).

```bash
npx convex login
```

**For Development (Test Mode):**
Ensure `.env.local` has:

```bash
STRIPE_SECRET_KEY=sk_test_...
```

_(Note: NEXT_PUBLIC_CONVEX_URL is no longer strictly required for the script as it uses the active local CLI config, but good to keep)._

Run:

```bash
npm run sync-plans
```

**For Production (Live Mode):**
Simply update your environment variables to use your **Live** Stripe Secret Key (`sk_live_...`).

The script detects the live key and **automatically** runs the Convex mutation against your **Production** deployment (`--prod`).

```bash
# Example (assuming env vars are set for prod)
npm run sync-plans
```

## Key Benefits

- **Zero Manual Copy-Paste**: No more copying Price IDs from terminal logs.
- **Idempotent**: Run it as many times as you want; it won't duplicate prices.
- **Atomic**: Stripe and Convex are updated in the same workflow.
