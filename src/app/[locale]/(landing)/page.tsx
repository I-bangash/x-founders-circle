"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useQuery } from "convex/react";
import gsap from "gsap";
import { ExternalLink, MessageSquare, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { api } from "../../../../convex/_generated/api";

// --- Types ---
type Tab = "today" | "all";
type SortOption = "latest" | "most" | "least";
type EngagementMode = "engaged" | "missing";
type LeaderboardTab = "global" | "today";

export default function SignalTerminal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  // --- Data Fetching ---
  const members = useQuery(api.mvp.getMembers) || [];
  const posts = useQuery(api.mvp.getPosts) || [];
  const engagements = useQuery(api.mvp.getEngagements) || [];

  // --- State ---
  const [activeTab, setActiveTab] = useState<Tab>("today");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Scroll listener for Navbar background
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- GSAP Animations ---
  useEffect(() => {
    if (!members.length && !posts.length) return; // Wait for data

    const ctx = gsap.context(() => {
      // Timeline for coordinated entrance
      const tl = gsap.timeline();

      // Top member bar fades in and slides down
      tl.fromTo(
        ".operator-grid",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );

      // Posts cascade upward
      tl.fromTo(
        ".post-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // Leaderboard slides in
      tl.fromTo(
        ".leaderboard-section",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.2"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [members.length, posts.length, activeTab, sortBy]); // Re-trigger on data or filter change

  // --- Derived Data ---
  const sortedMembers = [...members].sort((a, b) =>
    (a.username || "").localeCompare(b.username || "")
  );

  const filteredPosts = posts.filter((post: any) => {
    if (activeTab === "today") {
      const isToday =
        new Date(post.createdAt).toDateString() === new Date().toDateString();
      if (!isToday) return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        post.authorUsername.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
      );
    }
    return true;
  });

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
    <div
      ref={containerRef}
      className="bg-background text-foreground relative min-h-screen font-['Inter',sans-serif] selection:bg-blue-500/30"
    >
      {/* Noise Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* A. NAVBAR - "Control Header" */}
      <header
        className={`fixed top-0 right-0 left-0 z-40 h-[64px] transition-all duration-300 ${
          isScrolled
            ? "bg-card border-border border-b"
            : "bg-background/80 border-border/50 border-b backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          {/* Left: Logotype */}
          <div className="flex-1">
            <Link
              href="/"
              className="text-foreground text-lg font-bold tracking-tight"
            >
              OutliersX
            </Link>
          </div>

          {/* Center: Tab Switcher */}
          <div className="flex flex-1 justify-center">
            <div className="bg-card border-border flex items-center rounded-full border p-1">
              <button
                onClick={() => setActiveTab("today")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  activeTab === "today"
                    ? "bg-muted text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  activeTab === "all"
                    ? "bg-muted text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Posts
              </button>
            </div>
          </div>

          {/* Right: Search & Sort */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="group relative hidden sm:block">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 transition-colors group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-card border-border text-foreground placeholder-muted-foreground w-48 rounded-full border py-1.5 pr-4 pl-9 text-sm transition-all focus:border-blue-500/50 focus:outline-none"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-card border-border text-foreground cursor-pointer appearance-none rounded-full border px-3 py-1.5 text-sm transition-all focus:border-blue-500/50 focus:outline-none"
            >
              <option value="latest">Latest</option>
              <option value="most">Most Engaged</option>
              <option value="least">Least Engaged</option>
            </select>

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="bg-card border-border text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full border transition-colors focus:border-blue-500/50 focus:outline-none"
                aria-label="Toggle Theme"
              >
                <Sun className="h-4 w-4 dark:hidden" />
                <Moon className="hidden h-4 w-4 dark:block" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Spacer */}
      <div className="pt-[64px]" />

      {/* B. TOP MEMBER STRIP - "Operator Grid" */}
      <div className="operator-grid border-border bg-background border-b">
        {/* Horizontal scrollable row */}
        <div className="hide-scrollbar mask-edges flex overflow-x-auto px-6 py-4">
          <div className="mx-auto flex min-w-max gap-4">
            {sortedMembers.map((member) => {
              const globalEngagements = engagements.filter(
                (e: any) => e.twitterUserId === member.twitterId
              ).length;

              return (
                <div
                  key={member._id}
                  className="group relative flex flex-col items-center gap-2"
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 cursor-pointer border-2 border-transparent transition-all duration-300 group-hover:border-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/30">
                      <AvatarImage
                        src={member.image}
                        alt={member.name || member.username}
                      />
                      <AvatarFallback className="bg-muted text-foreground">
                        {(member.name || member.username || "M")
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {globalEngagements > 0 && (
                      <div className="bg-card border-border text-foreground absolute -right-1 -bottom-1 flex h-5 min-w-[20px] items-center justify-center rounded-full border px-1 font-['JetBrains_Mono',monospace] text-[10px]">
                        {globalEngagements}
                      </div>
                    )}
                  </div>
                  <div className="bg-muted border-border text-foreground pointer-events-none absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2 rounded border px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                    @{member.twitterUsername || member.username}
                  </div>
                </div>
              );
            })}
            {members.length === 0 && (
              <div className="text-muted-foreground py-2 text-sm">
                No operators found.
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .mask-edges {
          mask-image: linear-gradient(
            to right,
            transparent,
            black 5%,
            black 95%,
            transparent
          );
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Layout Wrapper for Timeline & Leaderboard */}
      <div className="mx-auto flex max-w-[720px] flex-col gap-12 px-4 py-8">
        {/* C. MAIN TIMELINE - "Post Column" */}
        <div className="flex flex-col gap-6">
          {posts.length === 0 ? (
            <div className="text-muted-foreground border-border bg-card/50 rounded-3xl border border-dashed py-20 text-center">
              Initializing signal feed...
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="text-muted-foreground border-border bg-card/50 rounded-3xl border border-dashed py-20 text-center">
              No signals match criteria.
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

        {/* E. LEADERBOARD - "Performance Index" */}
        <Leaderboard members={members} engagements={engagements} />
      </div>
    </div>
  );
}

// --- D. POST CARD - "Engagement Unit" ---
function PostCard({
  post,
  members,
  engagements,
}: {
  post: any;
  members: any[];
  engagements: any[];
}) {
  const [view, setView] = useState<EngagementMode>("engaged");
  const [showComments, setShowComments] = useState(false);

  const engagedTwitterIds = new Set(engagements.map((e) => e.twitterUserId));
  const engagedMembers = members.filter(
    (m) => m.twitterId && engagedTwitterIds.has(m.twitterId)
  );
  const missingMembers = members.filter(
    (m) => m.twitterId && !engagedTwitterIds.has(m.twitterId)
  );

  const displayMembers = view === "engaged" ? engagedMembers : missingMembers;

  const getEngagementTimestamp = (twitterId: string) => {
    const eng = engagements.find((e) => e.twitterUserId === twitterId);
    if (!eng) return null;
    return new Date(eng.engagedAt).toLocaleString();
  };

  return (
    <div className="post-card bg-card border-border rounded-3xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-[2px] sm:p-6">
      {/* 1. Header Row */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="border-border h-10 w-10 border">
            <AvatarImage src={post.authorAvatar} alt={post.authorName} />
            <AvatarFallback className="bg-muted text-foreground">
              {(post.authorName || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-semibold tracking-tight">
                {post.authorName}
              </span>
              <span className="text-muted-foreground text-sm">
                @{post.authorUsername}
              </span>
            </div>
            <div className="text-muted-foreground text-xs">
              {new Date(post.createdAt).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {post.threadData && post.threadData.length > 0 && (
            <button
              onClick={() => setShowComments(!showComments)}
              className={`hover:text-foreground flex items-center gap-1.5 text-xs font-medium transition-colors ${
                showComments ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="font-['JetBrains_Mono',monospace]">
                {post.threadData.length}
              </span>
            </button>
          )}
          <div className="text-muted-foreground bg-muted border-border rounded-md border px-2 py-1 font-['JetBrains_Mono',monospace] text-xs">
            <span className="text-blue-500">{engagedMembers.length}</span> /{" "}
            {members.length}
          </div>
          <a
            href={`https://x.com/${post.authorUsername}/status/${post.tweetId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors hover:scale-[1.02] active:scale-[0.98]"
            title="Open in X"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* 2. Content */}
      <div className="text-foreground mb-6 text-[15px] leading-relaxed text-wrap whitespace-pre-wrap">
        {post.content}
      </div>

      {/* Threads / Comments */}
      {showComments && post.threadData && post.threadData.length > 0 && (
        <div className="border-border/50 mt-4 mb-6 flex flex-col gap-8 border-t pt-6">
          {post.threadData.map((thread: any) => (
            <div key={thread.id} className="flex flex-col">
              {thread.tweets.map((tweet: any, index: number) => {
                const isLast = index === thread.tweets.length - 1;
                return (
                  <div key={tweet.id} className="group relative flex gap-3">
                    {/* Left column: Avatar + Thread Line */}
                    <div className="flex min-w-[32px] flex-col items-center">
                      <Avatar className="border-border bg-card z-10 h-8 w-8 shrink-0 border">
                        <AvatarImage
                          src={tweet.author.avatar}
                          alt={tweet.author.name}
                        />
                        <AvatarFallback className="bg-muted text-foreground text-xs">
                          {(tweet.author.name || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {!isLast && (
                        <div className="bg-border my-1 w-[2px] grow rounded-full transition-colors group-hover:bg-blue-500/40" />
                      )}
                    </div>

                    {/* Right column: Content */}
                    <div
                      className={`flex min-w-0 flex-1 flex-col ${!isLast ? "pb-6" : ""}`}
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="text-foreground text-[15px] font-semibold tracking-tight">
                          {tweet.author.name}
                        </span>
                        <span className="text-muted-foreground text-[13px]">
                          @{tweet.author.username}
                        </span>
                      </div>
                      <div className="text-foreground text-[14px] leading-relaxed text-wrap wrap-break-word whitespace-pre-wrap">
                        {tweet.content.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* 3. Engagement Panel */}
      <div className="border-border bg-background/50 rounded-2xl border p-4">
        {/* Toggle Switch */}
        <div className="border-border mb-4 flex items-center justify-between border-b pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setView("engaged")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                view === "engaged"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Engaged ({engagedMembers.length})
            </button>
            <button
              onClick={() => setView("missing")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                view === "missing"
                  ? "bg-destructive/10 text-destructive"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Missing ({missingMembers.length})
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="hidden items-center gap-2 sm:flex">
            <div className="bg-muted h-1.5 w-24 overflow-hidden rounded-full">
              <div
                className="h-full bg-emerald-500 transition-all duration-700 ease-out"
                style={{
                  width: `${members.length > 0 ? (engagedMembers.length / members.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Avatars Grid */}
        <div className="flex flex-wrap gap-2">
          {displayMembers.length === 0 ? (
            <div className="text-muted-foreground w-full py-4 text-center text-sm">
              {view === "engaged"
                ? "No signals detected yet."
                : "Maximum engagement achieved. No missing signals."}
            </div>
          ) : (
            displayMembers.map((m) => (
              <div key={m._id} className="group relative">
                <Avatar
                  className={`h-8 w-8 cursor-pointer transition-all duration-300 group-hover:scale-105 ${
                    view === "missing"
                      ? "group-hover:border-destructive border border-transparent opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0"
                      : "border-border border group-hover:border-emerald-500 group-hover:shadow-md group-hover:shadow-emerald-500/30"
                  }`}
                >
                  <AvatarImage src={m.image} alt={m.name || m.username} />
                  <AvatarFallback className="bg-muted text-foreground text-[10px]">
                    {(m.name || m.username || "M").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted border-border text-foreground pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 flex -translate-x-1/2 flex-col items-center gap-0.5 rounded border px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="font-semibold">
                    @{m.twitterUsername || m.username}
                  </span>
                  {view === "engaged" && (
                    <span className="text-muted-foreground font-['JetBrains_Mono',monospace] text-[10px]">
                      {getEngagementTimestamp(m.twitterId!)}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// --- E. LEADERBOARD - "Performance Index" ---
function Leaderboard({
  members,
  engagements,
}: {
  members: any[];
  engagements: any[];
}) {
  const [tab, setTab] = useState<LeaderboardTab>("global");

  const todayStr = new Date().toDateString();

  const getEngagementCount = (twitterId: string) => {
    return engagements.filter((e) => {
      if (e.twitterUserId !== twitterId) return false;
      if (tab === "today") {
        return new Date(e.engagedAt).toDateString() === todayStr;
      }
      return true;
    }).length;
  };

  const rankedMembers = [...members]
    .map((m) => ({ ...m, count: getEngagementCount(m.twitterId) }))
    .filter((m) => m.count > 0 || tab === "global") // Hide zeroes on today tab usually, but let's keep all for ranking
    .sort((a, b) => b.count - a.count);

  return (
    <div className="leaderboard-section border-border border-t pt-12 pb-20">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-foreground text-xl font-bold tracking-tight">
          Performance Index
        </h2>
        <div className="bg-card border-border flex items-center rounded-full border p-1">
          <button
            onClick={() => setTab("global")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              tab === "global"
                ? "bg-muted text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Global
          </button>
          <button
            onClick={() => setTab("today")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              tab === "today"
                ? "bg-muted text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Today
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {rankedMembers.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center text-sm">
            No data available.
          </div>
        ) : (
          rankedMembers.map((member, idx) => (
            <div
              key={member._id}
              className="group bg-card border-border flex items-center justify-between rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-[2px] hover:border-blue-500/40"
            >
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground group-hover:text-foreground w-6 text-center font-['JetBrains_Mono',monospace] text-sm font-semibold transition-colors">
                  {idx + 1}
                </span>
                <Avatar className="border-border h-10 w-10 border">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback className="bg-muted text-foreground">
                    {(member.name || member.username || "M")
                      .charAt(0)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-foreground text-sm font-medium tracking-tight">
                    {member.name || member.username}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    @{member.twitterUsername || member.username}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-foreground font-['JetBrains_Mono',monospace] text-lg font-bold">
                  {member.count}
                </span>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 opacity-0 shadow-md shadow-emerald-500/50 transition-opacity group-hover:opacity-100" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
