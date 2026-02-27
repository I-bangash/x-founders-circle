import { NextResponse } from "next/server";

import { fetchMutation, fetchQuery } from "convex/nextjs";

import { checkApiAuth } from "@/lib/api-auth";
import { parseTwitterData } from "@/lib/twitter";

import { api } from "../../../../convex/_generated/api";

export async function GET(req: Request) {
  if (!(await checkApiAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await fetchQuery(api.mvp.getPosts);
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  if (!(await checkApiAuth(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    if (!process.env.RAPIDAPI_KEY) {
      throw new Error(
        "Missing RAPIDAPI_KEY environment variable. Cannot securely fetch tweet data."
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
      `https://${process.env.RAPIDAPI_HOST || "real-time-x-com-data-scraper.p.rapidapi.com"}/v2/TweetDetail?id=${tweetId}`,
      options
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch tweet: ${response.status} ${response.statusText}`
      );
    }

    rawData = await response.json();

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

    // Fetch members early to filter threads
    const members = await fetchQuery(api.mvp.getMembers);

    // Filter threads to only keep those where a member participated
    const memberThreads = parsedFeed.threads.filter((thread) => {
      return thread.tweets.some((tweet) => {
        return members.some(
          (m) =>
            m.twitterUsername?.toLowerCase() ===
              tweet.author.username.toLowerCase() ||
            m.username?.toLowerCase() === tweet.author.username.toLowerCase()
        );
      });
    });

    // Check if post already exists
    let post = await fetchQuery(api.mvp.getPostByTweetId, {
      tweetId: parsedFeed.mainTweet!.id,
    });

    let postId = post?._id;

    if (!post) {
      postId = await fetchMutation(api.mvp.addPost, {
        tweetId: parsedFeed.mainTweet.id,
        authorTwitterId: parsedFeed.mainTweet.author.username, // Using username as ID fallback if no real ID
        authorUsername: parsedFeed.mainTweet.author.username,
        authorName: parsedFeed.mainTweet.author.name,
        authorAvatar: parsedFeed.mainTweet.author.avatar,
        content: parsedFeed.mainTweet.content.text,
        createdAt: new Date(parsedFeed.mainTweet.createdAt).getTime(), // Parsed from tweet
        fetchedAt: Date.now(),
        threadData: memberThreads,
      });
      // Mock post object for response
      post = {
        _id: postId,
        tweetId: parsedFeed.mainTweet.id,
      } as any;
    } else {
      // Update thread data on refresh
      await fetchMutation(api.mvp.addPost, {
        tweetId: parsedFeed.mainTweet.id,
        authorTwitterId: parsedFeed.mainTweet.author.username,
        authorUsername: parsedFeed.mainTweet.author.username,
        authorName: parsedFeed.mainTweet.author.name,
        authorAvatar: parsedFeed.mainTweet.author.avatar,
        content: parsedFeed.mainTweet.content.text,
        createdAt: post.createdAt,
        fetchedAt: Date.now(),
        threadData: memberThreads,
      });
    }

    // Process engagements (replies)
    const newEngagementsToInsert = [];

    for (const thread of memberThreads) {
      for (const tweet of thread.tweets) {
        // Skip self-engagements (if the author replies to their own post)
        if (
          tweet.author.username.toLowerCase() ===
          parsedFeed.mainTweet.author.username.toLowerCase()
        ) {
          continue;
        }

        // Find if this user is a member
        const member = members.find(
          (u) =>
            u.twitterUsername?.toLowerCase() ===
              tweet.author.username.toLowerCase() ||
            u.username?.toLowerCase() === tweet.author.username.toLowerCase()
        );

        if (member && member.twitterId) {
          newEngagementsToInsert.push({
            postId: postId as any,
            twitterUserId: member.twitterId,
            engagedAt: new Date(tweet.createdAt).getTime(),
            engagementType: "comment" as const,
            pointsEarned: 1,
          });
        }
      }
    }

    let newEngagementsCount = 0;
    if (newEngagementsToInsert.length > 0) {
      newEngagementsCount = await fetchMutation(api.mvp.addEngagements, {
        engagements: newEngagementsToInsert,
      });
    }

    return NextResponse.json({
      post,
      newEngagementsCount,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: `Failed to fetch post: ${error.message}` },
      { status: 500 }
    );
  }
}
