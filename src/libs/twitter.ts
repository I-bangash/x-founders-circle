// --- Utility for Tailwind classes ---
// (Not needed here, but kept for reference if needed elsewhere)

// --- Helper to format "Time Ago" ---
export function getTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return interval + "y";
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + "mo";
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return interval + "d";
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + "h";
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + "m";
  return Math.floor(seconds) + "s";
}

// --- Types ---
export interface ParsedTweet {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    timeAgo: string;
    isVerified: boolean;
  };
  content: {
    text: string;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
    isLiked: boolean;
    isBookmarked: boolean;
  };
}

export interface ParsedThread {
  id: string;
  tweets: ParsedTweet[];
}

export interface ParsedFeed {
  mainTweet: ParsedTweet | null;
  threads: ParsedThread[];
}

// --- The Parser Function ---
export function parseTwitterData(rawData: any): ParsedFeed {
  const feed: ParsedFeed = { mainTweet: null, threads: [] };

  try {
    // Determine if it's the old format or new format
    let entries =
      rawData?.data?.threaded_conversation_with_injections_v2?.instructions?.find(
        (inst: any) => inst.type === "TimelineAddEntries"
      )?.entries;

    if (!entries) {
      // Try alternative format if entries not found
      entries =
        rawData?.data?.tweetResult?.result?.timeline?.instructions?.find(
          (inst: any) => inst.type === "TimelineAddEntries"
        )?.entries;
    }

    if (!entries) {
      // If still no entries, maybe rawData is an array of tweets or a different structure
      // Let's check if it's the new format from real-time-x-com-data-scraper
      const result =
        rawData?.data?.tweet_result?.result ||
        rawData?.data?.tweetResult?.result ||
        rawData?.data;
      if (result && (result.__typename === "Tweet" || result.core)) {
        // It's a single tweet response
        const parsed = extractTweetData(result);
        if (parsed) feed.mainTweet = parsed;
        return feed;
      }
      return feed;
    }

    function extractTweetData(result: any): ParsedTweet | null {
      if (!result) return null;
      // Sometimes __typename is missing but core exists
      if (result.__typename !== "Tweet" && !result.core) return null;

      const core = result.core?.user_results?.result;
      const legacy = result.legacy;
      if (!core || !legacy) return null;

      // Handle truncated text for X Premium users
      const fullText =
        result.note_tweet?.note_tweet_results?.result?.text || legacy.full_text;

      return {
        id: legacy.id_str,
        author: {
          name: core.legacy?.name || "Unknown",
          username: core.legacy?.screen_name || "unknown",
          avatar:
            core.legacy?.profile_image_url_https?.replace(
              "_normal",
              "_400x400"
            ) || "",
          timeAgo: getTimeAgo(legacy.created_at || new Date().toISOString()),
          isVerified: core.is_blue_verified || false,
        },
        content: { text: fullText || "" },
        engagement: {
          likes: legacy.favorite_count || 0,
          comments: legacy.reply_count || 0,
          shares: legacy.retweet_count || 0,
          views: parseInt(result.views?.count || "0", 10) || 0,
          isLiked: false,
          isBookmarked: false,
        },
      };
    }

    for (const entry of entries) {
      // 1. Parse Main Tweet
      if (entry.entryId.startsWith("tweet-")) {
        const result = entry.content.itemContent?.tweet_results?.result;
        const parsed = extractTweetData(result);
        if (parsed) feed.mainTweet = parsed;
      }
      // 2. Parse Comments (Ignoring Ads/Promoted)
      else if (entry.entryId.startsWith("conversationthread-")) {
        const items = entry.content.items;
        const threadTweets: ParsedTweet[] = [];

        for (const itemObj of items) {
          // Skip Ads
          if (itemObj.item.itemContent?.promotedMetadata) continue;

          const result = itemObj.item.itemContent?.tweet_results?.result;
          const parsed = extractTweetData(result);
          if (parsed) threadTweets.push(parsed);
        }

        if (threadTweets.length > 0) {
          feed.threads.push({
            id: entry.entryId,
            tweets: threadTweets,
          });
        }
      }
    }

    return feed;
  } catch (error) {
    console.error("Failed to parse twitter data", error);
    return feed;
  }
}
