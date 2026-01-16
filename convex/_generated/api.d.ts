/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as convexTypes from "../convexTypes.js";
import type * as helper_convexHelperFunctions from "../helper/convexHelperFunctions.js";
import type * as helper_images from "../helper/images.js";
import type * as http from "../http.js";
import type * as stripe_billing from "../stripe/billing.js";
import type * as stripe_plans from "../stripe/plans.js";
import type * as users_organizationLimits from "../users/organizationLimits.js";
import type * as users_organizations from "../users/organizations.js";
import type * as users_users from "../users/users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  convexTypes: typeof convexTypes;
  "helper/convexHelperFunctions": typeof helper_convexHelperFunctions;
  "helper/images": typeof helper_images;
  http: typeof http;
  "stripe/billing": typeof stripe_billing;
  "stripe/plans": typeof stripe_plans;
  "users/organizationLimits": typeof users_organizationLimits;
  "users/organizations": typeof users_organizations;
  "users/users": typeof users_users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
