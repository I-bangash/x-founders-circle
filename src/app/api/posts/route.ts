import { NextResponse } from "next/server";

import { Engagement, Post, getDb, saveDb } from "@/libs/db";
import { parseTwitterData } from "@/libs/twitter";

export async function GET() {
  const db = getDb();
  return NextResponse.json(db.posts.sort((a, b) => b.createdAt - a.createdAt));
}

export async function POST(req: Request) {
  const { tweetId } = await req.json();

  if (!tweetId) {
    return NextResponse.json(
      { error: "Tweet ID is required" },
      { status: 400 }
    );
  }

  console.log(
    `Fetching tweet ${tweetId}. RapidAPI Key present: ${!!process.env.RAPIDAPI_KEY}`
  );

  try {
    let rawData;

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
        `https://${process.env.RAPIDAPI_HOST || "real-time-x-com-data-scraper.p.rapidapi.com"}/v2/TweetDetail?id=${tweetId}`,
        options
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch tweet: ${response.status} ${response.statusText}`
        );
      }

      rawData = await response.json();
    } else {
      // Mock fallback: read from our local twitter-response.json
      const fs = await import("fs");
      const path = await import("path");
      const mockDataPath = path.join(
        process.cwd(),
        "data",
        "twitter-response.json"
      );
      if (fs.existsSync(mockDataPath)) {
        rawData = JSON.parse(fs.readFileSync(mockDataPath, "utf8"));
      } else {
        throw new Error("No mock data available");
      }
    }

    const parsedFeed = parseTwitterData(rawData);

    if (!parsedFeed.mainTweet) {
      console.error(
        "Failed to parse main tweet. Raw Data Keys:",
        Object.keys(rawData || {})
      );
      if (rawData?.data) {
        console.error("Raw Data 'data' Keys:", Object.keys(rawData.data));
      }
      return NextResponse.json(
        {
          error: "Could not parse main tweet",
          debug: {
            keys: Object.keys(rawData || {}),
            dataKeys: rawData?.data ? Object.keys(rawData.data) : null,
          },
        },
        { status: 400 }
      );
    }

    const db = getDb();

    // Check if post already exists
    let post = db.posts.find((p) => p.tweetId === parsedFeed.mainTweet!.id);

    if (!post) {
      post = {
        id: crypto.randomUUID(),
        tweetId: parsedFeed.mainTweet.id,
        authorTwitterId: "unknown", // Would need to extract from rawData if not in parsed
        authorUsername: parsedFeed.mainTweet.author.username,
        authorName: parsedFeed.mainTweet.author.name,
        authorAvatar: parsedFeed.mainTweet.author.avatar,
        content: parsedFeed.mainTweet.content.text,
        createdAt: Date.now(), // Should parse from tweet, using now for mock
        fetchedAt: Date.now(),
        threadData: parsedFeed.threads,
      };
      db.posts.push(post);
    } else {
      // Update thread data on refresh
      post.threadData = parsedFeed.threads;
      post.fetchedAt = Date.now();
    }

    // Process engagements (replies)
    const newEngagements: Engagement[] = [];

    for (const thread of parsedFeed.threads) {
      for (const tweet of thread.tweets) {
        // Find if this user is a member
        const member = db.users.find(
          (u) => u.username === tweet.author.username
        );

        if (member) {
          // Check if engagement already exists
          const exists = db.engagements.find(
            (e) => e.postId === post!.id && e.twitterUserId === member.twitterId
          );

          if (!exists) {
            const engagement: Engagement = {
              id: crypto.randomUUID(),
              postId: post.id,
              twitterUserId: member.twitterId,
              engagedAt: Date.now(), // Should parse from tweet
            };
            db.engagements.push(engagement);
            newEngagements.push(engagement);
          }
        }
      }
    }

    saveDb(db);

    return NextResponse.json({
      post,
      newEngagementsCount: newEngagements.length,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: `Failed to fetch post: ${error.message}` },
      { status: 500 }
    );
  }
}
