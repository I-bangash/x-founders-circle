import { ConvexError } from "convex/values";

export type IdentityResponse = {
  userId: string;
  orgId: string;
  email?: string;
  name?: string;
};

export type ConvexErrorType = {
  code:
    | "UNAUTHORIZED"
    | "NOT_AUTHENTICATED"
    | "NO_WORKSPACE"
    | "INVALID_ARGUMENT"
    | "NOT_FOUND"
    | "INTERNAL_ERROR"
    | "CREATION_FAILED"
    | "UPDATE_FAILED"
    | "DELETION_FAILED"
    | "INVALID_OPERATION"
    | "CONFLICT"
    | "TIMEOUT"
    | "CANCELED"
    | "UNIMPLEMENTED"
    | "UNAVAILABLE";
  message: string;
};

export function getIdentityOrThrow(
  identity: any,
  callingFunction?: string,
): IdentityResponse {
  if (!identity) {
    throw new ConvexError<ConvexErrorType>({
      code: "NOT_AUTHENTICATED",
      message: "You must be logged in to perform this action",
    });
  }

  // Get userId from subject (primary) or tokenIdentifier (fallback)
  const userId = identity.subject || identity.tokenIdentifier?.split("|")[1];
  if (!userId) {
    console.log(
      "[getIdentityOrThrow] userId not found",
      callingFunction || "no calling function",
    );
    throw new ConvexError<ConvexErrorType>({
      code: "UNAUTHORIZED",
      message: "Unable to identify user. Please try logging out and back in.",
    });
  }

  // Get orgId from active_org (primary) or profileUrl (fallback)
  const orgId = identity.active_org || identity.profileUrl;
  if (!orgId) {
    console.log(
      "[getIdentityOrThrow] orgId not found",
      callingFunction || "no calling function",
    );
    throw new ConvexError<ConvexErrorType>({
      code: "NO_WORKSPACE",
      message:
        "No workspace selected. Please select or create a workspace to continue.",
    });
  }

  // Optional fields that might be useful in some contexts
  const email = identity.email;
  const name = identity.name || identity.givenName;

  return {
    userId,
    orgId,
    ...(email && { email }),
    ...(name && { name }),
  };
}

export function handleConvexError(error: any): never {
  if (error instanceof ConvexError) {
    throw error;
  }

  // Log the unexpected error internally but don't expose details to client
  console.error("[Convex Error]:", error);

  throw new ConvexError<ConvexErrorType>({
    code: "INTERNAL_ERROR",
    message: "An unexpected error occurred. Please try again later.",
  });
}

export function createConvexError(
  type: ConvexErrorType["code"],
  message: string,
): ConvexError<ConvexErrorType> {
  return new ConvexError<ConvexErrorType>({ code: type, message });
}

/**
 * Similar to getIdentityOrThrow but returns error response instead of throwing
 * Use this for functions that need to gracefully handle authentication errors
 */
export function getIdentityOrError(
  identity: any,
  callingFunction?: string,
): { success: true; data: IdentityResponse } | { success: false; error: ConvexErrorType } {
  if (!identity) {
    return {
      success: false,
      error: {
        code: "NOT_AUTHENTICATED",
        message: "Authentication required",
      },
    };
  }

  // Get userId from subject (primary) or tokenIdentifier (fallback)
  const userId = identity.subject || identity.tokenIdentifier?.split("|")[1];
  if (!userId) {
    console.log(
      "[getIdentityOrError] userId not found",
      callingFunction || "no calling function",
    );
    return {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Unable to identify user. Please try logging out and back in.",
      },
    };
  }

  // Get orgId from active_org (primary) or profileUrl (fallback)
  const orgId = identity.active_org || identity.profileUrl;
  if (!orgId) {
    console.log(
      "[getIdentityOrError] orgId not found",
      callingFunction || "no calling function",
    );
    return {
      success: false,
      error: {
        code: "NO_WORKSPACE",
        message: "No workspace selected. Please select or create a workspace to continue.",
      },
    };
  }

  // Optional fields that might be useful in some contexts
  const email = identity.email;
  const name = identity.name || identity.givenName;

  return {
    success: true,
    data: {
      userId,
      orgId,
      ...(email && { email }),
      ...(name && { name }),
    },
  };
}
