"use client";

// --- Imports ---
import Link from "next/link";
import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useQuery } from "convex/react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
} from "framer-motion";
import gsap from "gsap";
import {
  ExternalLink,
  LayoutGrid,
  List,
  MessageSquare,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
// Already installed in package.json
import useMeasure from "react-use-measure";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { cn } from "@/lib/utils";

import { api } from "../../../../convex/_generated/api";

// --- Infinite Slider Components ---
type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
};

function InfiniteSlider({
  children,
  gap = 16,
  speed = 50,
  speedOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let controls: any;
    const size = direction === "horizontal" ? width : height;
    if (size === 0) return;

    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    const distanceToTravel = Math.abs(to - from);
    const duration = distanceToTravel / currentSpeed;

    if (isTransitioning) {
      const remainingDistance = Math.abs(translation.get() - to);
      const transitionDuration = remainingDistance / currentSpeed;
      controls = animate(translation, [translation.get(), to], {
        ease: "linear",
        duration: transitionDuration,
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prevKey) => prevKey + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: "linear",
        duration: duration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    }

    return () => controls?.stop();
  }, [
    key,
    translation,
    currentSpeed,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
  ]);

  const hoverProps = speedOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setCurrentSpeed(speedOnHover);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setCurrentSpeed(speed);
        },
      }
    : {};

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        className="flex w-max"
        style={{
          ...(direction === "horizontal"
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        ref={ref}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

type BlurredInfiniteSliderProps = InfiniteSliderProps & {
  fadeWidth?: number;
  containerClassName?: string;
};

function BlurredInfiniteSlider({
  children,
  fadeWidth = 80,
  containerClassName,
  ...sliderProps
}: BlurredInfiniteSliderProps) {
  const maskStyle: CSSProperties = {
    maskImage: `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`,
    WebkitMaskImage: `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`,
  };

  return (
    <div
      className={cn("relative w-full", containerClassName)}
      style={maskStyle}
    >
      <InfiniteSlider {...sliderProps}>{children}</InfiniteSlider>
    </div>
  );
}

// --- Types ---
type Tab = "today" | "all" | "date";
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
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"feed" | "members">("feed");
  const [postView, setPostView] = useState<"list" | "grid">("list");
  const [membersView, setMembersView] = useState<"grid" | "leaderboard">(
    "grid"
  );

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
  // 1. Initial Load for Operator Grid
  useEffect(() => {
    if (!members.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".operator-grid",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [members.length]);

  // 2. Timeline and Leaderboard Animations (Trigger on filter/tab changes)
  useEffect(() => {
    if (!posts.length && viewMode === "feed") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

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
        }
      );

      // Leaderboard slides in
      tl.fromTo(
        ".leaderboard-section",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [posts.length, viewMode]);

  // --- Derived Data ---
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) =>
      (a.username || "").localeCompare(b.username || "")
    );
  }, [members]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post: any) => {
      if (activeTab === "today") {
        const isToday =
          new Date(post.createdAt).toDateString() === new Date().toDateString();
        if (!isToday) return false;
      }

      if (activeTab === "date" && selectedDate) {
        const isSelectedDate =
          new Date(post.createdAt).toDateString() ===
          selectedDate.toDateString();
        if (!isSelectedDate) return false;
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
  }, [posts, activeTab, selectedDate, searchQuery]);

  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      const aEngagements = a.engagementCount || 0;
      const bEngagements = b.engagementCount || 0;

      if (sortBy === "latest") return b.createdAt - a.createdAt;
      if (sortBy === "most") return bEngagements - aEngagements;
      if (sortBy === "least") return aEngagements - bEngagements;
      return 0;
    });
  }, [filteredPosts, sortBy]);

  const engagementsByPostId = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const e of engagements) {
      if (!map.has(e.postId)) {
        map.set(e.postId, []);
      }
      map.get(e.postId)!.push(e);
    }
    return map;
  }, [engagements]);

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
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-1 px-2 sm:gap-0 sm:px-6">
          {/* Left: Logotype */}
          <div className="flex flex-none items-center sm:flex-1">
            <Link
              href="/"
              className="text-foreground text-[11px] font-bold tracking-tight whitespace-nowrap sm:text-lg"
            >
              Founders on X
            </Link>
          </div>

          {/* Center: Tab Switcher */}
          <div className="flex justify-center sm:flex-1">
            <div className="bg-card border-border flex items-center gap-0.5 rounded-full border p-0.5 sm:gap-1 sm:p-1">
              <button
                onClick={() => {
                  setActiveTab("today");
                  setSelectedDate(undefined);
                }}
                className={`rounded-full px-2 py-1 text-[10px] font-medium transition-all sm:px-4 sm:py-1.5 sm:text-sm ${
                  activeTab === "today"
                    ? "bg-muted text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => {
                  setActiveTab("all");
                  setSelectedDate(undefined);
                }}
                className={`rounded-full px-2 py-1 text-[10px] font-medium transition-all sm:px-4 sm:py-1.5 sm:text-sm ${
                  activeTab === "all"
                    ? "bg-muted text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Posts
              </button>

              <div className="bg-border mx-0.5 h-4 w-[1px] sm:mx-1" />

              <DateRangePicker
                date={selectedDate}
                onDateChange={(date) => {
                  setSelectedDate(date);
                  if (date) setActiveTab("date");
                  else setActiveTab("today");
                }}
                className={`${
                  activeTab === "date"
                    ? "bg-muted text-foreground border-transparent shadow-sm"
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground border-transparent bg-transparent"
                } h-auto px-2 py-1 text-[10px] sm:px-4 sm:py-1.5 sm:text-xs`}
              />
            </div>
          </div>

          {/* Right: Search & Sort */}
          <div className="flex flex-none items-center justify-end gap-1 sm:flex-1 sm:gap-3">
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
              className="bg-card border-border text-foreground hidden cursor-pointer appearance-none rounded-full border px-3 py-1.5 text-sm transition-all focus:border-blue-500/50 focus:outline-none sm:block"
            >
              <option value="latest">Latest</option>
              <option value="most">Most Engaged</option>
              <option value="least">Least Engaged</option>
            </select>

            <div className="bg-card border-border flex items-center rounded-full border p-0.5 sm:p-1">
              <button
                onClick={() => setPostView("list")}
                className={`rounded-full p-1 transition-all sm:p-1.5 ${
                  postView === "list"
                    ? "bg-muted text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="List View"
              >
                <List className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              <button
                onClick={() => setPostView("grid")}
                className={`rounded-full p-1 transition-all sm:p-1.5 ${
                  postView === "grid"
                    ? "bg-muted text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Grid View"
              >
                <LayoutGrid className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="bg-card border-border text-muted-foreground hover:text-foreground flex h-6 w-6 items-center justify-center rounded-full border transition-colors focus:border-blue-500/50 focus:outline-none sm:h-8 sm:w-8"
                aria-label="Toggle Theme"
              >
                <Sun className="h-3 w-3 sm:h-4 sm:w-4 dark:hidden" />
                <Moon className="hidden h-3 w-3 sm:h-4 sm:w-4 dark:block" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Spacer */}
      <div className="pt-[64px]" />

      {/* A.5. GLOBAL STATS STRIP */}
      {/* <div className="border-border bg-card/50 border-b py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl justify-center gap-12 px-6">
          <div className="flex flex-col items-center gap-1">
            <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase sm:text-xs">
              Posts Tracked
            </span>
            <span className="text-foreground font-['JetBrains_Mono',monospace] text-xl font-bold sm:text-2xl">
              {posts.length}
            </span>
          </div>
          <div className="bg-border w-px"></div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase sm:text-xs">
              Total Engagements
            </span>
            <span className="font-['JetBrains_Mono',monospace] text-xl font-bold text-blue-500 sm:text-2xl">
              {engagements.length}
            </span>
          </div>
        </div>
      </div> */}

      {/* B. TOP MEMBER STRIP - "Operator Grid" */}
      <div className="operator-grid border-border bg-background border-b pt-4 pb-2">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 md:flex-row md:gap-8">
          <div className="md:border-border flex shrink-0 flex-col items-center justify-center text-center md:max-w-44 md:items-end md:border-r md:pr-6 md:text-right">
            <p className="text-muted-foreground mt-1 text-xs">
              Meet the A-Team:
            </p>
            <button
              onClick={() =>
                setViewMode(viewMode === "feed" ? "members" : "feed")
              }
              className="text-foreground mt-1 cursor-pointer rounded-full px-2 py-0 text-[11px] font-bold tracking-widest uppercase transition-transform hover:scale-[1.03] active:scale-[0.97]"
              style={{
                transitionTimingFunction:
                  "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              {viewMode === "feed" ? "View All" : "Show Feed"}
            </button>
          </div>

          <div className="w-full py-4 md:w-auto md:flex-1">
            {members.length > 0 ? (
              <BlurredInfiniteSlider
                speedOnHover={20}
                speed={30}
                gap={32}
                fadeWidth={40}
              >
                {sortedMembers.map((member) => {
                  const globalEngagements = member.totalEngagements || 0;

                  return (
                    <a
                      key={member._id}
                      href={`https://x.com/${member.twitterUsername || member.twitterUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex flex-col items-center gap-2"
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12 cursor-pointer border-2 border-transparent transition-all duration-300 group-hover:border-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/30">
                          <AvatarImage
                            src={member.image}
                            alt={member.twitterName || member.twitterUsername}
                          />
                          <AvatarFallback className="bg-muted text-foreground">
                            {(
                              member.twitterName ||
                              member.twitterUsername ||
                              "M"
                            )
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
                        @{member.twitterUsername || member.twitterUsername}
                      </div>
                    </a>
                  );
                })}
              </BlurredInfiniteSlider>
            ) : (
              <div className="text-muted-foreground w-full py-2 text-center text-sm">
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
      <div
        className={`mx-auto flex flex-col gap-12 px-4 py-8 transition-all duration-300 ${
          viewMode === "feed" && postView === "grid"
            ? "max-w-6xl"
            : "max-w-[720px]"
        }`}
      >
        <AnimatePresence mode="wait">
          {viewMode === "feed" ? (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col gap-12"
            >
              {/* C. MAIN TIMELINE - "Post Column" */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeTab}-${sortBy}-${postView}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={
                    postView === "grid"
                      ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                      : "flex flex-col gap-6"
                  }
                >
                  {posts.length === 0 ? (
                    <div
                      className={`text-muted-foreground border-border bg-card/50 rounded-3xl border border-dashed py-20 text-center ${
                        postView === "grid" ? "col-span-full" : ""
                      }`}
                    >
                      Initializing signal feed...
                    </div>
                  ) : sortedPosts.length === 0 ? (
                    <div
                      className={`text-muted-foreground border-border bg-card/50 rounded-3xl border border-dashed py-20 text-center ${
                        postView === "grid" ? "col-span-full" : ""
                      }`}
                    >
                      No posts found.
                    </div>
                  ) : (
                    sortedPosts.map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        members={members as any}
                        engagements={engagementsByPostId.get(post._id) || []}
                        layout={postView}
                      />
                    ))
                  )}
                </motion.div>
              </AnimatePresence>

              {/* E. LEADERBOARD - "Performance Index" */}
              <Leaderboard members={members} engagements={engagements} />
            </motion.div>
          ) : (
            <motion.div
              key="members"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col gap-6"
            >
              <div className="mb-4 flex flex-col justify-between gap-4 px-2 sm:flex-row sm:items-center">
                <h2 className="text-foreground text-xl font-bold tracking-tight">
                  {membersView === "grid" ? "All Members" : "Leaderboard"}
                </h2>

                <div className="flex items-center gap-2">
                  <div className="bg-card border-border flex items-center rounded-full border p-1">
                    <button
                      onClick={() => setMembersView("grid")}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                        membersView === "grid"
                          ? "bg-muted text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Grid View
                    </button>
                    <button
                      onClick={() => setMembersView("leaderboard")}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                        membersView === "leaderboard"
                          ? "bg-muted text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Leaderboard
                    </button>
                  </div>
                  <span className="text-muted-foreground bg-muted border-border hidden rounded-full border px-3 py-1 font-['JetBrains_Mono',monospace] text-xs sm:inline-block">
                    {members.length} Total
                  </span>
                </div>
              </div>

              {membersView === "grid" ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {sortedMembers.map((member) => {
                    const globalEngagements = member.totalEngagements || 0;
                    return (
                      <a
                        key={member._id}
                        href={`https://x.com/${member.twitterUsername || member.twitterUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-card border-border flex flex-col items-center gap-4 rounded-3xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-blue-500/40"
                      >
                        <Avatar className="border-border h-16 w-16 border transition-all duration-300 group-hover:border-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/30">
                          <AvatarImage
                            src={member.image}
                            alt={member.twitterName || member.twitterUsername}
                          />
                          <AvatarFallback className="bg-muted text-foreground">
                            {(
                              member.twitterName ||
                              member.twitterUsername ||
                              "M"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-center text-center">
                          <span className="text-foreground text-sm font-semibold tracking-tight">
                            {member.twitterName || member.twitterUsername}
                          </span>
                          <span className="text-muted-foreground mt-0.5 text-xs">
                            @{member.twitterUsername || member.twitterUsername}
                          </span>
                        </div>
                        <div className="bg-background border-border text-muted-foreground mt-1 rounded-full border px-3 py-1.5 font-['JetBrains_Mono',monospace] text-xs transition-colors group-hover:border-blue-500/30 group-hover:bg-blue-500/10 group-hover:text-blue-500">
                          <span className="text-foreground font-bold group-hover:text-blue-500">
                            {globalEngagements}
                          </span>{" "}
                          Engagements
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <Leaderboard
                  members={members}
                  engagements={engagements}
                  limit={members.length}
                  className="pt-2 pb-20"
                  title="Rankings"
                  description="Members ranked by engagement points"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- D. POST CARD - "Engagement Unit" ---
function PostCard({
  post,
  members,
  engagements,
  layout = "list",
}: {
  post: any;
  members: any[];
  engagements: any[];
  layout?: "list" | "grid";
}) {
  const [view, setView] = useState<EngagementMode>("engaged");
  const [showComments, setShowComments] = useState(false);

  const { engagedMembers, missingMembers } = useMemo(() => {
    const engagedTwitterIds = new Set(engagements.map((e) => e.twitterUserId));
    const engaged = members.filter(
      (m) => m.twitterId && engagedTwitterIds.has(m.twitterId)
    );
    const missing = members.filter(
      (m) => m.twitterId && !engagedTwitterIds.has(m.twitterId)
    );
    return { engagedMembers: engaged, missingMembers: missing };
  }, [members, engagements]);

  const displayMembers = view === "engaged" ? engagedMembers : missingMembers;

  const getEngagementTimestamp = useCallback(
    (twitterId: string) => {
      const eng = engagements.find((e) => e.twitterUserId === twitterId);
      if (!eng) return null;
      return new Date(eng.engagedAt).toLocaleString();
    },
    [engagements]
  );

  return (
    <div
      className={`post-card bg-card border-border flex flex-col rounded-3xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-[2px] sm:p-6 ${
        layout === "grid" ? "h-full" : ""
      }`}
    >
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
                {layout === "grid" && post.authorName?.length > 15
                  ? `${post.authorName.substring(0, 15)}...`
                  : post.authorName}
              </span>
              {layout === "list" && (
                <span className="text-muted-foreground text-sm">
                  @{post.authorUsername}
                </span>
              )}
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
          {post.threadData &&
            post.threadData.length > 0 &&
            layout === "list" && (
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
          {/* <div className="text-muted-foreground bg-muted border-border rounded-md border px-2 py-1 font-['JetBrains_Mono',monospace] text-xs">
            <span className="text-blue-500">{engagedMembers.length}</span> /{" "}
            {members.length}
          </div> */}
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
      <a
        href={`https://x.com/${post.authorUsername}/status/${post.tweetId}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-foreground mb-6 cursor-pointer text-[15px] leading-relaxed text-wrap whitespace-pre-wrap transition-opacity hover:opacity-80 ${
          layout === "grid" ? "line-clamp-4" : "block"
        }`}
      >
        {post.content}
      </a>

      {/* Threads / Comments */}
      {showComments &&
        post.threadData &&
        post.threadData.length > 0 &&
        layout === "list" && (
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
                        <a
                          href={`https://x.com/${tweet.author.username}/status/${tweet.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground block cursor-pointer text-[14px] leading-relaxed text-wrap wrap-break-word whitespace-pre-wrap transition-opacity hover:opacity-80"
                        >
                          {tweet.content.text}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

      {/* 3. Engagement Panel */}
      <div
        className={`border-border bg-background/50 rounded-2xl border ${
          layout === "grid" ? "mt-auto p-2" : "p-4"
        }`}
      >
        {/* Toggle Switch */}
        <div
          className={`border-border flex items-center justify-between border-b ${
            layout === "grid" ? "mb-2 pb-2" : "mb-4 pb-3"
          }`}
        >
          <div className={`flex ${layout === "grid" ? "gap-1" : "gap-2"}`}>
            <button
              onClick={() => setView("engaged")}
              className={`rounded-full font-medium transition-all duration-300 ${
                layout === "grid"
                  ? "px-2 py-1 text-[10px]"
                  : "px-3 py-1.5 text-xs"
              } ${
                view === "engaged"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Engaged ({engagedMembers.length})
            </button>
            <button
              onClick={() => setView("missing")}
              className={`rounded-full font-medium transition-all duration-300 ${
                layout === "grid"
                  ? "px-2 py-1 text-[10px]"
                  : "px-3 py-1.5 text-xs"
              } ${
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
        <div
          className={`flex flex-wrap gap-2 ${
            layout === "grid"
              ? "hide-scrollbar h-[76px] content-start overflow-y-auto pr-1"
              : ""
          }`}
        >
          {displayMembers.length === 0 ? (
            <div className="text-muted-foreground w-full py-1.5 text-center text-sm">
              {view === "engaged"
                ? "No posts found yet."
                : "Maximum engagement achieved. No missing posts."}
            </div>
          ) : (
            displayMembers.map((m) => (
              <a
                key={m._id}
                href={`https://x.com/${m.twitterUsername || m.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block"
              >
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
              </a>
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
  limit = 5,
  className = "leaderboard-section border-border border-t pt-12 pb-20",
  title = "Hall of Fame",
  description = "Members with most engagements",
}: {
  members: any[];
  engagements: any[];
  limit?: number;
  className?: string;
  title?: string;
  description?: string;
}) {
  const [tab, setTab] = useState<LeaderboardTab>("global");

  const todayStr = useMemo(() => new Date().toDateString(), []);

  const getEngagementCount = useCallback(
    (twitterId: string, totalEngagements?: number) => {
      if (tab === "global") {
        return totalEngagements || 0;
      }
      return engagements.filter((e) => {
        if (e.twitterUserId !== twitterId) return false;
        return new Date(e.engagedAt).toDateString() === todayStr;
      }).length;
    },
    [tab, engagements, todayStr]
  );

  const rankedMembers = useMemo(() => {
    return [...members]
      .filter((m) => m.username !== "ibangash_")
      .map((m) => ({
        ...m,
        count: getEngagementCount(m.twitterId, m.totalEngagements),
      }))
      .filter((m) => m.count > 0 || tab === "global") // Hide zeroes on today tab usually, but let's keep all for ranking
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }, [members, getEngagementCount, tab, limit]);

  return (
    <div className={className}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-xl font-bold tracking-tight">
            {title}
          </h2>
          <p className="text-muted-foreground mt-1 text-xs">{description}</p>
        </div>
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
                  <AvatarImage src={member.image} alt={member.twitterName} />
                  <AvatarFallback className="bg-muted text-foreground">
                    {(member.twitterName || member.twitterUsername || "M")
                      .charAt(0)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-foreground text-sm font-medium tracking-tight">
                    {member.twitterName || member.twitterUsername}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    @{member.twitterUsername || member.twitterUsername}
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
