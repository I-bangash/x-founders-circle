"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CheckCircle2, ExternalLink, Search, XCircle } from "lucide-react";

import { Engagement, Post, User } from "@/libs/db";

import { TweetRow } from "./TwitterFeedMVP";

export default function Feed() {
  const [members, setMembers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);

  const [activeTab, setActiveTab] = useState<"today" | "all">("today");
  const [sortBy, setSortBy] = useState<"latest" | "most" | "least">("latest");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/members").then((res) => res.json()),
      fetch("/api/posts").then((res) => res.json()),
      fetch("/api/engagements").then((res) => res.json()),
    ]).then(([m, p, e]) => {
      setMembers(m);
      setPosts(p);
      setEngagements(e);
    });
  }, []);

  // Filter posts
  const filteredPosts = posts.filter((post) => {
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
      (e) => e.postId === (a._id || a.id)
    ).length;
    const bEngagements = engagements.filter(
      (e) => e.postId === (b._id || b.id)
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
          <h1 className="text-xl font-bold">OutliersX</h1>
          <div className="flex gap-4 text-sm">
            <Link
              href="/leaderboard"
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              Leaderboard
            </Link>
            <Link href="/dashboard" className="text-blue-500 hover:underline">
              Admin
            </Link>
          </div>
        </div>

        {/* Member Bar */}
        <div className="hide-scrollbar flex gap-3 overflow-x-auto border-t border-zinc-100 px-4 py-3 dark:border-zinc-900">
          {members
            .sort((a, b) => a.username.localeCompare(b.username))
            .map((member) => (
              <div
                key={member._id || member.id}
                className="flex w-14 shrink-0 flex-col items-center gap-1"
              >
                <img
                  src={member.profileImageUrl}
                  alt={member.name}
                  className="h-12 w-12 rounded-full border border-zinc-200 dark:border-zinc-800"
                />
                <span className="w-full truncate text-center text-[10px] text-zinc-500">
                  @{member.username}
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
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border-none bg-zinc-100 py-1.5 pr-3 pl-8 text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500 sm:w-40 dark:bg-zinc-900"
                suppressHydrationWarning
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="cursor-pointer appearance-none rounded-full border-none bg-zinc-100 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900"
              suppressHydrationWarning
            >
              <option value="latest">Latest</option>
              <option value="most">Most Engaged</option>
              <option value="least">Least Engaged</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {sortedPosts.length === 0 ? (
          <div className="p-10 text-center text-zinc-500">No posts found.</div>
        ) : (
          sortedPosts.map((post) => (
            <PostCard
              key={post._id || post.id}
              post={post}
              members={members}
              engagements={engagements.filter(
                (e) => e.postId === (post._id || post.id)
              )}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PostCard({
  post,
  members,
  engagements,
}: {
  post: Post;
  members: User[];
  engagements: Engagement[];
}) {
  const [showEngaged, setShowEngaged] = useState(true);

  const engagedTwitterIds = new Set(engagements.map((e) => e.twitterUserId));
  const engagedMembers = members.filter((m) =>
    engagedTwitterIds.has(m.twitterId)
  );
  const missingMembers = members.filter(
    (m) => !engagedTwitterIds.has(m.twitterId)
  );

  const displayMembers = showEngaged ? engagedMembers : missingMembers;

  // Convert DB Post to ParsedTweet for TweetRow
  const mainTweet = {
    id: post.tweetId,
    author: {
      name: post.authorName,
      username: post.authorUsername,
      avatar: post.authorAvatar,
      timeAgo: new Date(post.createdAt).toLocaleDateString(),
      isVerified: true, // Mock
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
              <div
                key={m._id || m.id}
                className="group relative cursor-pointer"
              >
                <img
                  src={m.profileImageUrl}
                  alt={m.name}
                  className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-700"
                />
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 rounded bg-zinc-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                  @{m.username}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Add utility function for cn
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
