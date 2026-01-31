import { getPostHogServer } from "@/libs/posthog-server";

const posthog = getPostHogServer();

export async function GET() {
  try {
    throw new Error("Test error for PostHog exception tracking");
  } catch (error) {
    posthog.captureException(error);
    return new Response("Error", { status: 500 });
  }
}
