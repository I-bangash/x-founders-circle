"use client";

import { useState, useEffect } from "react";
import { User, Post, Engagement } from "@/lib/db";
import { Search, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function Feed() {
  const [members, setMembers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  
  const [activeTab, setActiveTab] = useState<"today" | "all">("today");
  const [sortBy, setSortBy] = useState<"latest" | "most" | "least">("latest");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/members").then(res => res.json()),
      fetch("/api/posts").then(res => res.json()),
      fetch("/api/engagements").then(res => res.json())
    ]).then(([m, p, e]) => {
      setMembers(m);
      setPosts(p);
      setEngagements(e);
    });
  }, []);

  // Filter posts
  const filteredPosts = posts.filter(post => {
    // Tab filter
    if (activeTab === "today") {
      const isToday = new Date(post.createdAt).toDateString() === new Date().toDateString();
      if (!isToday) return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return post.authorUsername.toLowerCase().includes(query) || 
             post.content.toLowerCase().includes(query);
    }
    
    return true;
  });

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const aEngagements = engagements.filter(e => e.postId === a.id).length;
    const bEngagements = engagements.filter(e => e.postId === b.id).length;
    
    if (sortBy === "latest") return b.createdAt - a.createdAt;
    if (sortBy === "most") return bEngagements - aEngagements;
    if (sortBy === "least") return aEngagements - bEngagements;
    return 0;
  });

  return (
    <div className="max-w-2xl mx-auto min-h-screen border-x border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">OutliersX</h1>
          <div className="flex gap-4 text-sm">
            <Link href="/leaderboard" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">Leaderboard</Link>
            <Link href="/dashboard" className="text-blue-500 hover:underline">Admin</Link>
          </div>
        </div>
        
        {/* Member Bar */}
        <div className="flex gap-3 overflow-x-auto px-4 py-3 hide-scrollbar border-t border-zinc-100 dark:border-zinc-900">
          {members.sort((a, b) => a.username.localeCompare(b.username)).map(member => (
            <div key={member.id} className="flex flex-col items-center shrink-0 w-14 gap-1">
              <img src={member.profileImageUrl} alt={member.name} className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800" />
              <span className="text-[10px] text-zinc-500 truncate w-full text-center">@{member.username}</span>
            </div>
          ))}
          {members.length === 0 && (
            <div className="text-sm text-zinc-500 py-2">No members added yet.</div>
          )}
        </div>

        {/* Controls */}
        <div className="px-4 py-2 flex flex-col sm:flex-row gap-3 justify-between border-t border-zinc-100 dark:border-zinc-900">
          <div className="flex gap-4 text-sm font-medium">
            <button 
              onClick={() => setActiveTab("today")}
              className={cn("pb-2 border-b-2 transition-colors", activeTab === "today" ? "border-blue-500 text-zinc-900 dark:text-white" : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300")}
            >
              Today
            </button>
            <button 
              onClick={() => setActiveTab("all")}
              className={cn("pb-2 border-b-2 transition-colors", activeTab === "all" ? "border-blue-500 text-zinc-900 dark:text-white" : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300")}
            >
              All Posts
            </button>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm rounded-full bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-40 transition-all"
                suppressHydrationWarning
              />
            </div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm rounded-full bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 border-none focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
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
          sortedPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              members={members} 
              engagements={engagements.filter(e => e.postId === post.id)} 
            />
          ))
        )}
      </div>
    </div>
  );
}

import { TweetRow } from "./TwitterFeedMVP";

function PostCard({ post, members, engagements }: { post: Post, members: User[], engagements: Engagement[] }) {
  const [showEngaged, setShowEngaged] = useState(true);
  
  const engagedTwitterIds = new Set(engagements.map(e => e.twitterUserId));
  const engagedMembers = members.filter(m => engagedTwitterIds.has(m.twitterId));
  const missingMembers = members.filter(m => !engagedTwitterIds.has(m.twitterId));

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
    }
  };

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
      {/* Main Tweet */}
      <TweetRow tweet={mainTweet} hasThreadLine={post.threadData && post.threadData.length > 0} />
      
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
      <div className="mt-4 mx-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl p-3 border border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2 bg-zinc-200/50 dark:bg-zinc-800/50 p-1 rounded-lg">
            <button 
              onClick={() => setShowEngaged(true)}
              className={cn("px-3 py-1 text-xs font-medium rounded-md transition flex items-center gap-1.5", showEngaged ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300")}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              Engaged ({engagedMembers.length})
            </button>
            <button 
              onClick={() => setShowEngaged(false)}
              className={cn("px-3 py-1 text-xs font-medium rounded-md transition flex items-center gap-1.5", !showEngaged ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300")}
            >
              <XCircle className="w-3.5 h-3.5 text-red-500" />
              Missing ({missingMembers.length})
            </button>
          </div>
          <div className="text-xs text-zinc-500 font-medium">
            {Math.round((engagedMembers.length / Math.max(members.length, 1)) * 100)}% Participation
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {displayMembers.length === 0 ? (
            <div className="text-sm text-zinc-500 py-1">
              {showEngaged ? "No one has engaged yet." : "Everyone has engaged!"}
            </div>
          ) : (
            displayMembers.map(m => (
              <div key={m.id} className="relative group cursor-pointer">
                <img src={m.profileImageUrl} alt={m.name} className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-zinc-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
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
