"use client";

import Link from "next/link";
import { useState } from "react";

import { useQuery } from "convex/react";
import { CheckCircle2, Search, XCircle } from "lucide-react";

import { TweetRow } from "@/components/TwitterFeedMVP";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export default function MVPLandingPage() {
  const members = useQuery(api.mvp.getMembers) || [];
  const posts = useQuery(api.mvp.getPosts) || [];
  const engagements = useQuery(api.mvp.getEngagements) || [];

  const [activeTab, setActiveTab] = useState<"today" | "all" | "leaderboard">(
    "today"
  );
  const [sortBy, setSortBy] = useState<"latest" | "most" | "least">("latest");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter posts
  const filteredPosts = posts.filter((post: any) => {
    // Tab filter
    if (activeTab === "today") {
      const isToday =
        new Date(post.createdAt).toDateString() === new Date().toDateString();
      if (!isToday) return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        post.authorUsername.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const aEngagements = engagements.filter(
      (e: any) => e.postId === a._id
    ).length;
    const bEngagements = engagements.filter(
      (e: any) => e.postId === b._id
    ).length;

    if (sortBy === "latest") return b.createdAt - a.createdAt;
    if (sortBy === "most") return bEngagements - aEngagements;
    if (sortBy === "least") return aEngagements - bEngagements;
    return 0;
  });

  return (
    <div className="mx-auto min-h-screen max-w-2xl border-x border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">FoundersOnX</h1>
          <div className="flex gap-4 text-sm">
            <Link href="/dashboard" className="text-blue-500 hover:underline">
              Admin
            </Link>
          </div>
        </div>

        {/* Member Bar */}
        <div className="hide-scrollbar flex gap-3 overflow-x-auto border-t border-zinc-100 px-4 py-3 dark:border-zinc-900">
          {[...members]
            .sort((a, b) => (a.username || "").localeCompare(b.username || ""))
            .map((member) => (
              <div
                key={member._id}
                className="flex w-14 shrink-0 flex-col items-center gap-1"
              >
                <img
                  src={
                    member.image ||
                    `https://picsum.photos/seed/${member._id}/200/200`
                  }
                  alt={member.name || member.username || "Member"}
                  className="h-12 w-12 rounded-full border border-zinc-200 dark:border-zinc-800"
                />
                <span className="w-full truncate text-center text-[10px] text-zinc-500">
                  @{member.twitterUsername || member.username}
                </span>
              </div>
            ))}
          {members.length === 0 && (
            <div className="py-2 text-sm text-zinc-500">
              No members added yet.
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col justify-between gap-3 border-t border-zinc-100 px-4 py-2 sm:flex-row dark:border-zinc-900">
          <div className="flex gap-4 text-sm font-medium">
            <button
              onClick={() => setActiveTab("today")}
              className={cn(
                "border-b-2 pb-2 transition-colors",
                activeTab === "today"
                  ? "border-blue-500 text-zinc-900 dark:text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              Today
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "border-b-2 pb-2 transition-colors",
                activeTab === "all"
                  ? "border-blue-500 text-zinc-900 dark:text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              All Posts
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={cn(
                "border-b-2 pb-2 transition-colors",
                activeTab === "leaderboard"
                  ? "border-blue-500 text-zinc-900 dark:text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              Leaderboard
            </button>
          </div>

          {activeTab !== "leaderboard" && (
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-zinc-200 bg-zinc-100 py-1.5 pr-3 pl-8 text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500 sm:w-40 dark:border-zinc-800 dark:bg-zinc-900"
                  suppressHydrationWarning
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="cursor-pointer appearance-none rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900"
                suppressHydrationWarning
              >
                <option value="latest">Latest</option>
                <option value="most">Most Engaged</option>
                <option value="least">Least Engaged</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "leaderboard" ? (
        <Leaderboard
          members={members as any}
          engagements={engagements as any}
        />
      ) : (
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {posts.length === 0 ? (
            <div className="p-10 text-center text-zinc-500">
              Loading or no posts found.
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="p-10 text-center text-zinc-500">
              No posts match your filters.
            </div>
          ) : (
            sortedPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                members={members as any}
                engagements={
                  engagements.filter((e: any) => e.postId === post._id) as any
                }
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function PostCard({
  post,
  members,
  engagements,
}: {
  post: any;
  members: any[];
  engagements: any[];
}) {
  const [showEngaged, setShowEngaged] = useState(true);

  const engagedTwitterIds = new Set(engagements.map((e) => e.twitterUserId));
  const engagedMembers = members.filter(
    (m) => m.twitterId && engagedTwitterIds.has(m.twitterId)
  );
  const missingMembers = members.filter(
    (m) => m.twitterId && !engagedTwitterIds.has(m.twitterId)
  );

  const displayMembers = showEngaged ? engagedMembers : missingMembers;

  const mainTweet = {
    id: post.tweetId,
    author: {
      name: post.authorName,
      username: post.authorUsername,
      avatar: post.authorAvatar,
      timeAgo: new Date(post.createdAt).toLocaleDateString(),
      isVerified: true,
    },
    content: {
      text: post.content,
    },
    engagement: {
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      isLiked: false,
      isBookmarked: false,
    },
  };

  return (
    <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
      {/* Main Tweet */}
      <TweetRow
        tweet={mainTweet}
        hasThreadLine={post.threadData && post.threadData.length > 0}
      />

      {/* Replies / Threads */}
      {post.threadData && post.threadData.length > 0 && (
        <div className="flex flex-col">
          {post.threadData.map((thread: any) => (
            <div key={thread.id} className="flex flex-col">
              {thread.tweets.map((tweet: any, index: number) => {
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
          ))}
        </div>
      )}

      {/* Engagement Row */}
      <div className="mx-4 mt-4 rounded-xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex gap-2 rounded-lg bg-zinc-200/50 p-1 dark:bg-zinc-800/50">
            <button
              onClick={() => setShowEngaged(true)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition",
                showEngaged
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              Engaged ({engagedMembers.length})
            </button>
            <button
              onClick={() => setShowEngaged(false)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition",
                !showEngaged
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              <XCircle className="h-3.5 w-3.5 text-red-500" />
              Missing ({missingMembers.length})
            </button>
          </div>
          <div className="text-xs font-medium text-zinc-500">
            {Math.round(
              (engagedMembers.length / Math.max(members.length, 1)) * 100
            )}
            % Participation
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {displayMembers.length === 0 ? (
            <div className="py-1 text-sm text-zinc-500">
              {showEngaged
                ? "No one has engaged yet."
                : "Everyone has engaged!"}
            </div>
          ) : (
            displayMembers.map((m) => (
              <div key={m._id} className="group relative cursor-pointer">
                <img
                  src={m.image || `https://picsum.photos/seed/${m._id}/200/200`}
                  alt={m.name}
                  className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-700"
                />
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 rounded bg-zinc-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                  @{m.twitterUsername || m.username}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

function Leaderboard({
  members,
  engagements,
}: {
  members: any[];
  engagements: any[];
}) {
  const [mode, setMode] = useState<"global" | "daily">("global");

  const todayStr = new Date().toDateString();

  const getEngagementCount = (twitterId: string) => {
    return engagements.filter((e) => {
      if (e.twitterUserId !== twitterId) return false;
      if (mode === "daily") {
        return new Date(e.engagedAt).toDateString() === todayStr;
      }
      return true;
    }).length;
  };

  const rankedMembers = [...members]
    .map((m) => ({ ...m, engagements: getEngagementCount(m.twitterId) }))
    .sort((a, b) => b.engagements - a.engagements);

  return (
    <div className="p-4">
      <div className="mx-auto mb-6 flex w-fit gap-2 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
        <button
          onClick={() => setMode("global")}
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-medium transition",
            mode === "global"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          Global
        </button>
        <button
          onClick={() => setMode("daily")}
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-medium transition",
            mode === "daily"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          Daily
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {rankedMembers.map((member, idx) => (
          <div
            key={member._id}
            className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-center gap-4">
              <span className="w-6 text-center text-lg font-bold text-zinc-400">
                {idx + 1}
              </span>
              <img
                src={
                  member.image ||
                  `https://picsum.photos/seed/${member._id}/200/200`
                }
                alt={member.name}
                className="h-12 w-12 rounded-full border border-zinc-200 dark:border-zinc-800"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {member.name || member.username}
                </span>
                <span className="text-xs text-zinc-500">
                  @{member.twitterUsername || member.username}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold">{member.engagements}</span>
              <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                Engagements
              </span>
            </div>
          </div>
        ))}
        {rankedMembers.length === 0 && (
          <div className="py-10 text-center text-sm text-zinc-500">
            No members found.
          </div>
        )}
      </div>
    </div>
  );
}
