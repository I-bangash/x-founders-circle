// app/api/test-error/route.js

import { getPostHogServer } from "@/lib/posthog-server";

const posthog = getPostHogServer();

export async function GET() {
  try {
    throw new Error(
      "Last test for backend error. change this to anything you want when sending the error to posthog"
    );
  } catch (error) {
    posthog.captureException(error);
    return new Response("Error", { status: 500 });
  }
}
