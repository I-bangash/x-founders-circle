"use client";

import React, { useState } from "react";

import { type ClassValue, clsx } from "clsx";
import {
  BarChart2,
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Share,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

import {
  ParsedFeed,
  ParsedThread,
  ParsedTweet,
  parseTwitterData,
} from "@/libs/twitter";

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
    <div className="relative flex cursor-pointer gap-3 bg-white px-4 pt-3 pb-2 transition hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900/50">
      {/* Left Column: Avatar & Line */}
      <div className="flex w-10 shrink-0 flex-col items-center">
        <img
          src={author.avatar}
          alt={author.name}
          className="z-10 h-10 w-10 rounded-full object-cover"
        />
        {hasThreadLine && (
          <div className="absolute top-[52px] bottom-[-12px] z-0 w-0.5 bg-zinc-200 dark:bg-zinc-800" />
        )}
      </div>

      {/* Right Column: Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 truncate text-[15px]">
            <span className="truncate font-bold text-zinc-900 hover:underline dark:text-zinc-100">
              {author.name}
            </span>
            {author.isVerified && (
              <svg
                viewBox="0 0 24 24"
                aria-label="Verified account"
                className="h-[1.1em] w-[1.1em] shrink-0 fill-current text-blue-500"
              >
                <g>
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.918-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.918 1.792-3.918 4 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.46.74 2.746 1.867 3.45-.032.205-.05.414-.05.63 0 2.208 1.71 3.998 3.918 3.998.47 0 .92-.084 1.336-.25C9.182 21.585 10.49 22.5 12 22.5s2.816-.917 3.337-2.25c.416.165.866.25 1.336.25 2.21 0 3.918-1.792 3.918-4 0-.216-.018-.425-.05-.63 1.127-.704 1.867-1.99 1.867-3.45zm-10.45 5.09l-4.226-4.225 1.414-1.414 2.812 2.813 7.054-7.054 1.414 1.414-8.468 8.466z"></path>
                </g>
              </svg>
            )}
            <span className="truncate text-zinc-500 dark:text-zinc-400">
              @{author.username}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">·</span>
            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
              Member
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">·</span>
            <span className="shrink-0 text-zinc-500 hover:underline dark:text-zinc-400">
              {author.timeAgo}
            </span>
          </div>
          <button className="ml-2 shrink-0 rounded-full p-1.5 text-zinc-500 transition hover:bg-blue-500/10 hover:text-blue-500">
            <MoreHorizontal className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-0.5 text-[15px] leading-normal break-words whitespace-pre-wrap text-zinc-900 dark:text-zinc-100">
          {content.text}
        </div>

        {/* Actions */}
        <div className="mt-1 flex max-w-md items-center justify-between text-zinc-500 dark:text-zinc-400">
          <button className="group flex items-center gap-1 transition hover:text-blue-500">
            <div className="-ml-2 rounded-full p-2 group-hover:bg-blue-500/10">
              <MessageCircle className="h-[18px] w-[18px]" />
            </div>
            <span className="text-[13px]">
              {formatNumber(engagement.comments)}
            </span>
          </button>
          <button className="group flex items-center gap-1 transition hover:text-green-500">
            <div className="rounded-full p-2 group-hover:bg-green-500/10">
              <Repeat2 className="h-[18px] w-[18px]" />
            </div>
            <span className="text-[13px]">
              {formatNumber(engagement.shares)}
            </span>
          </button>
          <button className="group flex items-center gap-1 transition hover:text-rose-500">
            <div className="rounded-full p-2 group-hover:bg-rose-500/10">
              <Heart className="h-[18px] w-[18px]" />
            </div>
            <span className="text-[13px]">
              {formatNumber(engagement.likes)}
            </span>
          </button>
          <button className="group flex items-center gap-1 transition hover:text-blue-500">
            <div className="rounded-full p-2 group-hover:bg-blue-500/10">
              <BarChart2 className="h-[18px] w-[18px]" />
            </div>
            <span className="text-[13px]">
              {formatNumber(engagement.views)}
            </span>
          </button>
          <div className="flex items-center">
            <button className="rounded-full p-2 transition hover:bg-blue-500/10 hover:text-blue-500">
              <Bookmark className="h-[18px] w-[18px]" />
            </button>
            <button className="rounded-full p-2 transition hover:bg-blue-500/10 hover:text-blue-500">
              <Share className="h-[18px] w-[18px]" />
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
          <TweetRow key={tweet.id} tweet={tweet} hasThreadLine={!isLast} />
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
    <div className="mx-auto min-h-screen w-full max-w-[600px] border-x border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Post
        </h2>
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
