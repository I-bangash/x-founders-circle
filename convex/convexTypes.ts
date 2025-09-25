// Types for error handling
/**
 * GenericConvexResponse provides a standardized structure for API responses
 * in Convex functions. It allows functions to return either successful data (T)
 * or a detailed error object.
 *
 * Usage in Convex functions:
 * - For a successful response: return { data: yourResult };
 * - For an error response: return { error: { code: "ERROR_CODE", message: "Error description" } };
 */
export type GenericConvexResponse<T> = {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};
