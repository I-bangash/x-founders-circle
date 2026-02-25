"use client";

import React, { useState } from "react";
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Repeat2, BarChart2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseTwitterData, ParsedFeed, ParsedTweet, ParsedThread } from "@/lib/twitter";

// --- Utility for Tailwind classes ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- 2. The Tweet UI Component ---
export function TweetRow({
  tweet,
  hasThreadLine = false,
}: {
  tweet: ParsedTweet;
  hasThreadLine?: boolean;
}) {
  const { author, content, engagement } = tweet;

  // Format numbers (e.g., 1500 -> 1.5K)
  const formatNumber = (num: number) => {
    if (num === 0) return "";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="flex gap-3 px-4 pt-3 pb-2 bg-white dark:bg-zinc-950 transition hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer relative">
      {/* Left Column: Avatar & Line */}
      <div className="flex flex-col items-center shrink-0 w-10">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-10 h-10 rounded-full object-cover z-10"
        />
        {hasThreadLine && (
          <div className="w-0.5 bg-zinc-200 dark:bg-zinc-800 absolute top-[52px] bottom-[-12px] z-0" />
        )}
      </div>

      {/* Right Column: Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[15px] truncate">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate hover:underline">
              {author.name}
            </span>
            {author.isVerified && (
              <svg viewBox="0 0 24 24" aria-label="Verified account" className="w-[1.1em] h-[1.1em] text-blue-500 fill-current shrink-0"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.918-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.918 1.792-3.918 4 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.46.74 2.746 1.867 3.45-.032.205-.05.414-.05.63 0 2.208 1.71 3.998 3.918 3.998.47 0 .92-.084 1.336-.25C9.182 21.585 10.49 22.5 12 22.5s2.816-.917 3.337-2.25c.416.165.866.25 1.336.25 2.21 0 3.918-1.792 3.918-4 0-.216-.018-.425-.05-.63 1.127-.704 1.867-1.99 1.867-3.45zm-10.45 5.09l-4.226-4.225 1.414-1.414 2.812 2.813 7.054-7.054 1.414 1.414-8.468 8.466z"></path></g></svg>
            )}
            <span className="text-zinc-500 dark:text-zinc-400 truncate">
              @{author.username}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">·</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-bold text-[11px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
              Member
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">·</span>
            <span className="text-zinc-500 dark:text-zinc-400 hover:underline shrink-0">
              {author.timeAgo}
            </span>
          </div>
          <button className="text-zinc-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full p-1.5 transition shrink-0 ml-2">
            <MoreHorizontal className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Body */}
        <div className="text-[15px] text-zinc-900 dark:text-zinc-100 mt-0.5 whitespace-pre-wrap break-words leading-normal">
          {content.text}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-1 text-zinc-500 dark:text-zinc-400 max-w-md">
          <button className="flex items-center gap-1 hover:text-blue-500 transition group">
            <div className="p-2 rounded-full group-hover:bg-blue-500/10 -ml-2">
              <MessageCircle className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[13px]">{formatNumber(engagement.comments)}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-green-500 transition group">
            <div className="p-2 rounded-full group-hover:bg-green-500/10">
              <Repeat2 className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[13px]">{formatNumber(engagement.shares)}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-rose-500 transition group">
            <div className="p-2 rounded-full group-hover:bg-rose-500/10">
              <Heart className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[13px]">{formatNumber(engagement.likes)}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-blue-500 transition group">
            <div className="p-2 rounded-full group-hover:bg-blue-500/10">
              <BarChart2 className="w-[18px] h-[18px]" />
            </div>
            <span className="text-[13px]">{formatNumber(engagement.views)}</span>
          </button>
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition">
              <Bookmark className="w-[18px] h-[18px]" />
            </button>
            <button className="p-2 rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition">
              <Share className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 3. Thread Container ---
function ThreadContainer({ thread }: { thread: ParsedThread }) {
  return (
    <div className="flex flex-col border-b border-zinc-200 dark:border-zinc-800">
      {thread.tweets.map((tweet, index) => {
        const isLast = index === thread.tweets.length - 1;
        return (
          <TweetRow 
            key={tweet.id} 
            tweet={tweet} 
            hasThreadLine={!isLast} 
          />
        );
      })}
    </div>
  );
}

// --- 4. Main Feed Component ---
export default function TwitterFeedMVP({ rawJsonData }: { rawJsonData: any }) {
  const [feedData, setFeedData] = useState<ParsedFeed | null>(null);

  React.useEffect(() => {
    if (rawJsonData) {
      const parsed = parseTwitterData(rawJsonData);
      setFeedData(parsed);
    }
  }, [rawJsonData]);

  if (!feedData) {
    return (
      <div className="flex justify-center p-10 text-zinc-500">
        Loading or no data available...
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] mx-auto border-x border-zinc-200 dark:border-zinc-800 min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Post</h2>
      </div>

      {/* Main Tweet */}
      {feedData.mainTweet && (
        <div className="border-b border-zinc-200 dark:border-zinc-800">
          <TweetRow tweet={feedData.mainTweet} />
        </div>
      )}

      {/* Replies / Threads */}
      <div className="flex flex-col">
        {feedData.threads.map((thread) => (
          <ThreadContainer key={thread.id} thread={thread} />
        ))}
      </div>
    </div>
  );
}

