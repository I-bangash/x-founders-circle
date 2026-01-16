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
import type * as emails_reminder from "../emails/reminder.js";
import type * as emails_templates_WelcomeEmail from "../emails/templates/WelcomeEmail.js";
import type * as emails_templates_marketplace_ReceiptEmail from "../emails/templates/marketplace/ReceiptEmail.js";
import type * as emails_templates_userNotificationEmail from "../emails/templates/userNotificationEmail.js";
import type * as emails_userEmails from "../emails/userEmails.js";
import type * as helper_convexHelperFunctions from "../helper/convexHelperFunctions.js";
import type * as helper_images from "../helper/images.js";
import type * as http from "../http.js";
import type * as stripe_billing from "../stripe/billing.js";
import type * as stripe_plans from "../stripe/plans.js";
import type * as stripe_stripeActions from "../stripe/stripeActions.js";
import type * as userFunctions_clerk from "../userFunctions/clerk.js";
import type * as userFunctions_memberships from "../userFunctions/memberships.js";
import type * as userFunctions_organizationLimits from "../userFunctions/organizationLimits.js";
import type * as userFunctions_organizations from "../userFunctions/organizations.js";
import type * as userFunctions_users from "../userFunctions/users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  convexTypes: typeof convexTypes;
  "emails/reminder": typeof emails_reminder;
  "emails/templates/WelcomeEmail": typeof emails_templates_WelcomeEmail;
  "emails/templates/marketplace/ReceiptEmail": typeof emails_templates_marketplace_ReceiptEmail;
  "emails/templates/userNotificationEmail": typeof emails_templates_userNotificationEmail;
  "emails/userEmails": typeof emails_userEmails;
  "helper/convexHelperFunctions": typeof helper_convexHelperFunctions;
  "helper/images": typeof helper_images;
  http: typeof http;
  "stripe/billing": typeof stripe_billing;
  "stripe/plans": typeof stripe_plans;
  "stripe/stripeActions": typeof stripe_stripeActions;
  "userFunctions/clerk": typeof userFunctions_clerk;
  "userFunctions/memberships": typeof userFunctions_memberships;
  "userFunctions/organizationLimits": typeof userFunctions_organizationLimits;
  "userFunctions/organizations": typeof userFunctions_organizations;
  "userFunctions/users": typeof userFunctions_users;
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
