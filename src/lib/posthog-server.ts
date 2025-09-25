import { PostHog } from "posthog-node";

let posthogInstance: PostHog | null = null;

export function getPostHogServer() {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    console.error(
      "NEXT_PUBLIC_POSTHOG_KEY is not set in the environment variables"
    );
    throw new Error(
      "NEXT_PUBLIC_POSTHOG_KEY is not set in the environment variables"
    );
  }

  if (!posthogInstance) {
    posthogInstance = new PostHog(
      process.env.NEXT_PUBLIC_POSTHOG_KEY as string,
      {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        flushAt: 1,
        flushInterval: 0,
      }
    );
  }

  return posthogInstance;
}
