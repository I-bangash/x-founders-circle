import { ConvexError } from "convex/values";

// ============================================================================
// Response Type - Use this for all your Convex functions
// ============================================================================

/**
 * Wrap your Convex function return types with this.
 *
 * @example
 * async handler(ctx, args): Promise<ConvexResponse<User[]>> { ... }
 */
export type ConvexResponse<T> =
  | { data: T; error?: never }
  | { data?: never; error: { code: string; message: string } };

// ============================================================================
// Error Codes - Common error types
// ============================================================================

export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// ============================================================================
// Helper Functions - Copy-paste ready
// ============================================================================

/** Return success data */
export function success<T>(data: T): ConvexResponse<T> {
  return { data };
}

/** Return an error */
export function error<T>(code: string, message: string): ConvexResponse<T> {
  return { error: { code, message } };
}

/**
 * Use in catch blocks - logs error server-side, returns safe message to client
 *
 * @example
 * catch (err) {
 *   return fail(err, "Failed to fetch documents");
 * }
 */
export function fail<T>(
  err: unknown,
  fallbackMessage: string
): ConvexResponse<T> {
  // Log full error server-side (visible in Convex dashboard logs)
  console.error("[Convex Error]", err);

  // If we threw this error intentionally, extract its data
  if (err instanceof ConvexError) {
    const data = err.data as { code?: string; message?: string };
    return {
      error: {
        code: data.code ?? ERROR_CODES.INTERNAL_ERROR,
        message: data.message ?? fallbackMessage,
      },
    };
  }

  // For unexpected errors, return generic message (don't leak internals)
  return {
    error: {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: fallbackMessage,
    },
  };
}

/** Throw an error that fail() will catch */
export function throwErr(code: string, message: string): never {
  throw new ConvexError({ code, message });
}

// ============================================================================
// Type Guard - Use this on the frontend
// ============================================================================

/** Check if response is an error - use early return pattern */
export function isError<T>(
  response: ConvexResponse<T>
): response is { data?: never; error: { code: string; message: string } } {
  return "error" in response && response.error !== undefined;
}
