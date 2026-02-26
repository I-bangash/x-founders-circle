"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import gsap from "gsap";
import { ExternalLink, MessageSquare, Search } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "../../../../convex/_generated/api";

// --- Types ---
type Tab = "today" | "all";
type SortOption = "latest" | "most" | "least";
type EngagementMode = "engaged" | "missing";
type LeaderboardTab = "global" | "today";

export default function SignalTerminal() {
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Data Fetching ---
  const members = useQuery(api.mvp.getMembers) || [];
  const posts = useQuery(api.mvp.getPosts) || [];
  const engagements = useQuery(api.mvp.getEngagements) || [];

  // --- State ---
  const [activeTab, setActiveTab] = useState<Tab>("today");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener for Navbar background
  useEffect(() => {
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
    const aEngagements = engagements.filter((e: any) => e.postId === a._id).length;
    const bEngagements = engagements.filter((e: any) => e.postId === b._id).length;

    if (sortBy === "latest") return b.createdAt - a.createdAt;
    if (sortBy === "most") return bEngagements - aEngagements;
    if (sortBy === "least") return aEngagements - bEngagements;
    return 0;
  });

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#0E1116] text-[#E6EDF3] font-['Inter',sans-serif] selection:bg-[#4C8DFF]/30"
    >
      {/* Noise Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* A. NAVBAR - "Control Header" */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 h-[64px] transition-all duration-300 ${
          isScrolled
            ? "bg-[#151A22] border-b border-[#242C38]"
            : "bg-[#0E1116]/80 backdrop-blur-sm border-b border-[#242C38]/50"
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          {/* Left: Logotype */}
          <div className="flex-1">
            <Link href="/" className="text-lg font-bold tracking-tight text-[#E6EDF3]">
              OutliersX
            </Link>
          </div>

          {/* Center: Tab Switcher */}
          <div className="flex justify-center flex-1">
            <div className="flex items-center rounded-full bg-[#151A22] border border-[#242C38] p-1">
              <button
                onClick={() => setActiveTab("today")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  activeTab === "today"
                    ? "bg-[#1C222C] text-[#E6EDF3] shadow-sm"
                    : "text-[#8B98A5] hover:text-[#E6EDF3]"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  activeTab === "all"
                    ? "bg-[#1C222C] text-[#E6EDF3] shadow-sm"
                    : "text-[#8B98A5] hover:text-[#E6EDF3]"
                }`}
              >
                All Posts
              </button>
            </div>
          </div>

          {/* Right: Search & Sort */}
          <div className="flex items-center justify-end gap-3 flex-1">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B98A5] transition-colors group-focus-within:text-[#4C8DFF]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 rounded-full bg-[#151A22] border border-[#242C38] py-1.5 pl-9 pr-4 text-sm text-[#E6EDF3] placeholder-[#8B98A5] focus:outline-none focus:border-[#4C8DFF]/50 transition-all"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-full bg-[#151A22] border border-[#242C38] px-3 py-1.5 text-sm text-[#E6EDF3] focus:outline-none focus:border-[#4C8DFF]/50 transition-all appearance-none cursor-pointer"
            >
              <option value="latest">Latest</option>
              <option value="most">Most Engaged</option>
              <option value="least">Least Engaged</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content Spacer */}
      <div className="pt-[64px]" />

      {/* B. TOP MEMBER STRIP - "Operator Grid" */}
      <div className="operator-grid border-b border-[#242C38] bg-[#0E1116]">
        {/* Horizontal scrollable row */}
        <div className="hide-scrollbar flex overflow-x-auto px-6 py-4 mask-edges">
          <div className="flex gap-4 mx-auto min-w-max">
            {sortedMembers.map((member) => {
              const globalEngagements = engagements.filter(
                (e: any) => e.twitterUserId === member.twitterId
              ).length;

              return (
                <div key={member._id} className="group relative flex flex-col items-center gap-2">
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-transparent transition-all duration-300 group-hover:border-[#4C8DFF] group-hover:shadow-[0_0_12px_rgba(76,141,255,0.3)] cursor-pointer">
                      <AvatarImage src={member.image} alt={member.name || member.username} />
                      <AvatarFallback className="bg-[#1C222C] text-[#E6EDF3]">
                        {(member.name || member.username || "M").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {globalEngagements > 0 && (
                      <div className="absolute -bottom-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#151A22] border border-[#242C38] px-1 text-[10px] font-['JetBrains_Mono',monospace] text-[#E6EDF3]">
                        {globalEngagements}
                      </div>
                    )}
                  </div>
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 rounded bg-[#1C222C] border border-[#242C38] px-2 py-1 text-xs text-[#E6EDF3] opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    @{member.twitterUsername || member.username}
                  </div>
                </div>
              );
            })}
            {members.length === 0 && (
              <div className="text-sm text-[#8B98A5] py-2">No operators found.</div>
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
      <div className="mx-auto max-w-[720px] px-4 py-8 flex flex-col gap-12">
        {/* C. MAIN TIMELINE - "Post Column" */}
        <div className="flex flex-col gap-6">
          {posts.length === 0 ? (
            <div className="py-20 text-center text-[#8B98A5] border border-dashed border-[#242C38] rounded-3xl bg-[#151A22]/50">
              Initializing signal feed...
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="py-20 text-center text-[#8B98A5] border border-dashed border-[#242C38] rounded-3xl bg-[#151A22]/50">
              No signals match criteria.
            </div>
          ) : (
            sortedPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                members={members as any}
                engagements={engagements.filter((e: any) => e.postId === post._id) as any}
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
    <div className="post-card bg-[#151A22] rounded-3xl border border-[#242C38] p-5 sm:p-6 transition-all duration-300 hover:-translate-y-[2px] shadow-sm">
      {/* 1. Header Row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-[#242C38]">
            <AvatarImage src={post.authorAvatar} alt={post.authorName} />
            <AvatarFallback className="bg-[#1C222C] text-[#E6EDF3]">
              {(post.authorName || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#E6EDF3] tracking-tight">
                {post.authorName}
              </span>
              <span className="text-sm text-[#8B98A5]">@{post.authorUsername}</span>
            </div>
            <div className="text-xs text-[#8B98A5]">
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
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-[#E6EDF3] ${
                showComments ? "text-[#E6EDF3]" : "text-[#8B98A5]"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="font-['JetBrains_Mono',monospace]">{post.threadData.length}</span>
            </button>
          )}
          <div className="text-[#8B98A5] text-xs font-['JetBrains_Mono',monospace] bg-[#1C222C] px-2 py-1 rounded-md border border-[#242C38]">
            <span className="text-[#4C8DFF]">{engagedMembers.length}</span> / {members.length}
          </div>
          <a
            href={`https://x.com/${post.authorUsername}/status/${post.tweetId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B98A5] hover:text-[#E6EDF3] transition-colors hover:scale-[1.02] active:scale-[0.98]"
            title="Open in X"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* 2. Content */}
      <div className="text-[#E6EDF3] text-[15px] leading-relaxed whitespace-pre-wrap text-wrap mb-6">
        {post.content}
      </div>

      {/* Threads / Comments */}
      {showComments && post.threadData && post.threadData.length > 0 && (
        <div className="mb-6 mt-4 flex flex-col gap-8 border-t border-[#242C38]/50 pt-6">
          {post.threadData.map((thread: any) => (
            <div key={thread.id} className="flex flex-col">
              {thread.tweets.map((tweet: any, index: number) => {
                const isLast = index === thread.tweets.length - 1;
                return (
                  <div key={tweet.id} className="group relative flex gap-3">
                    {/* Left column: Avatar + Thread Line */}
                    <div className="flex flex-col items-center min-w-[32px]">
                      <Avatar className="h-8 w-8 shrink-0 border border-[#242C38] z-10 bg-[#151A22]">
                        <AvatarImage src={tweet.author.avatar} alt={tweet.author.name} />
                        <AvatarFallback className="bg-[#1C222C] text-[#E6EDF3] text-xs">
                          {(tweet.author.name || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {!isLast && (
                        <div className="w-[2px] grow bg-[#242C38] my-1 group-hover:bg-[#4C8DFF]/40 transition-colors rounded-full" />
                      )}
                    </div>
                    
                    {/* Right column: Content */}
                    <div className={`flex min-w-0 flex-1 flex-col ${!isLast ? "pb-6" : ""}`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-semibold text-[#E6EDF3] tracking-tight text-[15px]">
                          {tweet.author.name}
                        </span>
                        <span className="text-[13px] text-[#8B98A5]">@{tweet.author.username}</span>
                      </div>
                      <div className="text-[#E6EDF3] text-[14px] leading-relaxed whitespace-pre-wrap text-wrap break-words">
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
      <div className="rounded-2xl border border-[#242C38] bg-[#0E1116]/50 p-4">
        {/* Toggle Switch */}
        <div className="flex items-center justify-between mb-4 border-b border-[#242C38] pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setView("engaged")}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-300 ${
                view === "engaged"
                  ? "bg-[#3FB950]/10 text-[#3FB950]"
                  : "text-[#8B98A5] hover:text-[#E6EDF3]"
              }`}
            >
              Engaged ({engagedMembers.length})
            </button>
            <button
              onClick={() => setView("missing")}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-300 ${
                view === "missing"
                  ? "bg-[#F85149]/10 text-[#F85149]"
                  : "text-[#8B98A5] hover:text-[#E6EDF3]"
              }`}
            >
              Missing ({missingMembers.length})
            </button>
          </div>
          
          {/* Progress Indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-1.5 w-24 bg-[#1C222C] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#3FB950] transition-all duration-700 ease-out" 
                style={{ width: `${members.length > 0 ? (engagedMembers.length / members.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Avatars Grid */}
        <div className="flex flex-wrap gap-2">
          {displayMembers.length === 0 ? (
            <div className="w-full text-center py-4 text-sm text-[#8B98A5]">
              {view === "engaged" ? "No signals detected yet." : "Maximum engagement achieved. No missing signals."}
            </div>
          ) : (
            displayMembers.map((m) => (
              <div key={m._id} className="group relative">
                <Avatar
                  className={`h-8 w-8 cursor-pointer transition-all duration-300 group-hover:scale-105 ${
                    view === "missing"
                      ? "opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 border border-transparent group-hover:border-[#F85149]"
                      : "border border-[#242C38] group-hover:border-[#3FB950] group-hover:shadow-[0_0_8px_rgba(63,185,80,0.3)]"
                  }`}
                >
                  <AvatarImage src={m.image} alt={m.name || m.username} />
                  <AvatarFallback className="bg-[#1C222C] text-[#E6EDF3] text-[10px]">
                    {(m.name || m.username || "M").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded bg-[#1C222C] border border-[#242C38] px-2 py-1 text-xs text-[#E6EDF3] opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 flex flex-col items-center gap-0.5">
                  <span className="font-semibold">@{m.twitterUsername || m.username}</span>
                  {view === "engaged" && (
                    <span className="text-[10px] text-[#8B98A5] font-['JetBrains_Mono',monospace]">
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
function Leaderboard({ members, engagements }: { members: any[]; engagements: any[] }) {
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
    <div className="leaderboard-section border-t border-[#242C38] pt-12 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight text-[#E6EDF3]">Performance Index</h2>
        <div className="flex items-center rounded-full bg-[#151A22] border border-[#242C38] p-1">
          <button
            onClick={() => setTab("global")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              tab === "global"
                ? "bg-[#1C222C] text-[#E6EDF3] shadow-sm"
                : "text-[#8B98A5] hover:text-[#E6EDF3]"
            }`}
          >
            Global
          </button>
          <button
            onClick={() => setTab("today")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              tab === "today"
                ? "bg-[#1C222C] text-[#E6EDF3] shadow-sm"
                : "text-[#8B98A5] hover:text-[#E6EDF3]"
            }`}
          >
            Today
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {rankedMembers.length === 0 ? (
          <div className="text-center text-[#8B98A5] py-8 text-sm">No data available.</div>
        ) : (
          rankedMembers.map((member, idx) => (
            <div
              key={member._id}
              className="group flex items-center justify-between bg-[#151A22] border border-[#242C38] rounded-2xl p-4 transition-all duration-300 hover:-translate-y-[2px] hover:border-[#4C8DFF]/40"
            >
              <div className="flex items-center gap-4">
                <span className="w-6 text-center font-['JetBrains_Mono',monospace] text-sm font-semibold text-[#8B98A5] group-hover:text-[#E6EDF3] transition-colors">
                  {idx + 1}
                </span>
                <Avatar className="h-10 w-10 border border-[#242C38]">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback className="bg-[#1C222C] text-[#E6EDF3]">
                    {(member.name || member.username || "M").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-[#E6EDF3] font-medium tracking-tight text-sm">
                    {member.name || member.username}
                  </span>
                  <span className="text-xs text-[#8B98A5]">
                    @{member.twitterUsername || member.username}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-['JetBrains_Mono',monospace] text-lg font-bold text-[#E6EDF3]">
                  {member.count}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#3FB950] opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_#3FB950]" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
