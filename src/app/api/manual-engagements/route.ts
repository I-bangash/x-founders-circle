import { NextResponse } from "next/server";

import { fetchMutation } from "convex/nextjs";

import { checkApiAuth } from "@/lib/api-auth";

import { api } from "../../../../convex/_generated/api";

export async function POST(req: Request) {
  if (!(await checkApiAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { twitterUsername, tweetIds } = await req.json();
    if (!twitterUsername || !tweetIds || !tweetIds.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert comma-separated or array to string array
    const idArray = Array.isArray(tweetIds)
      ? tweetIds
      : tweetIds.split(",").map((id: string) => id.trim());

    const result = await fetchMutation(api.mvp.addManualEngagements, {
      twitterUsername: twitterUsername.replace("@", ""),
      tweetIds: idArray,
    });

    return NextResponse.json({ success: true, count: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await checkApiAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { twitterUsername, tweetIds } = await req.json();
    if (!twitterUsername || !tweetIds || !tweetIds.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const idArray = Array.isArray(tweetIds)
      ? tweetIds
      : tweetIds.split(",").map((id: string) => id.trim());

    const result = await fetchMutation(api.mvp.removeManualEngagements, {
      twitterUsername: twitterUsername.replace("@", ""),
      tweetIds: idArray,
    });

    return NextResponse.json({ success: true, count: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
