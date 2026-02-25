import { NextResponse } from "next/server";

import { getDb, saveDb } from "@/libs/db";

export async function GET() {
  const db = getDb();
  return NextResponse.json(db.users);
}

export async function POST(req: Request) {
  const { username } = await req.json();

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    let user;

    if (process.env.RAPIDAPI_KEY) {
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

      // Check for API specific error in 200 OK response
      if (data.error) {
        throw new Error(`API Error: ${data.error}`);
      }

      // Assuming standard Twitter API v2 or similar RapidAPI structure
      // Adjust based on actual RapidAPI response
      const result = data?.data?.user?.result || data;
      const legacy = result?.legacy || result;

      if (!result) {
        throw new Error("User not found in API response");
      }

      user = {
        id: crypto.randomUUID(),
        twitterId: result?.rest_id || result?.id_str || String(Date.now()),
        username: legacy?.screen_name || username,
        name: legacy?.name || username,
        profileImageUrl:
          legacy?.profile_image_url_https ||
          `https://picsum.photos/seed/${username}/200/200`,
        followersCount: legacy?.followers_count || 0,
        joinedAt: Date.now(),
      };
    } else {
      // Mock fallback
      user = {
        id: crypto.randomUUID(),
        twitterId: String(Math.floor(Math.random() * 1000000000)),
        username: username,
        name: username,
        profileImageUrl: `https://picsum.photos/seed/${username}/200/200`,
        followersCount: Math.floor(Math.random() * 10000),
        joinedAt: Date.now(),
      };
    }

    const db = getDb();
    if (
      !db.users.find((u) => u.username.toLowerCase() === username.toLowerCase())
    ) {
      db.users.push(user);
      saveDb(db);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
