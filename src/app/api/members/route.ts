import { NextResponse } from "next/server";

import { fetchMutation, fetchQuery } from "convex/nextjs";

import { checkApiAuth } from "@/lib/api-auth";

import { api } from "../../../../convex/_generated/api";

export async function GET(req: Request) {
  if (!(await checkApiAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const members = await fetchQuery(api.mvp.getMembers);
  return NextResponse.json(members);
}

export async function POST(req: Request) {
  if (!(await checkApiAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username } = await req.json();

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    let user;

    if (!process.env.RAPIDAPI_KEY) {
      throw new Error(
        "Missing RAPIDAPI_KEY environment variable. Cannot securely fetch user data."
      );
    }

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host":
          process.env.RAPIDAPI_HOST ||
          "real-time-x-com-data-scraper.p.rapidapi.com",
      },
    };

    const response = await fetch(
      `https://${process.env.RAPIDAPI_HOST || "real-time-x-com-data-scraper.p.rapidapi.com"}/v2/UserByScreenName?username=${username}`,
      options
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch user: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`API Error: ${data.error}`);
    }

    const result = data?.data?.user?.result || data;
    const legacy = result?.legacy || result;

    if (!result) {
      throw new Error("User not found in API response");
    }

    user = {
      twitterId: result?.rest_id || result?.id_str || String(Date.now()),
      username: legacy?.screen_name || username,
      name: legacy?.name || username,
      profileImageUrl:
        legacy?.profile_image_url_https?.replace("_normal", "_400x400") ||
        `https://picsum.photos/seed/${username}/200/200`,
      followersCount: legacy?.followers_count || 0,
      joinedAt: Date.now(),
    };

    const newMember = await fetchMutation(api.mvp.addMember, {
      twitterId: user.twitterId,
      twitterUsername: user.username,
      name: user.name,
      profileImageUrl: user.profileImageUrl,
      followersCount: user.followersCount,
      joinedAt: user.joinedAt,
    });

    return NextResponse.json({ ...newMember, username: user.username });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}
