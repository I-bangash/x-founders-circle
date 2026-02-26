"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Doc } from "@/convex/_generated/dataModel";

export default function AdminConsole() {
  const [members, setMembers] = useState<Doc<"users">[]>([]);
  const [posts, setPosts] = useState<Doc<"posts">[]>([]);
  const [engagements, setEngagements] = useState<Doc<"engagements">[]>([]);
  
  const [newMember, setNewMember] = useState("");
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
    fetchPosts();
    fetchEngagements();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members");
      if (res.ok) setMembers(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) setPosts(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  // Optional: fetch engagements to show counts
  const fetchEngagements = async () => {
    try {
      const res = await fetch("/api/engagements");
      if (res.ok) setEngagements(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember) return;
    setLoading(true);
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newMember.replace("@", "") }),
      });
      if (res.ok) {
        setNewMember("");
        fetchMembers();
      } else {
        const error = await res.json();
        alert(`Error: ${error.error || "Unknown"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Delete member and all engagements?")) return;
    try {
      const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMembers();
        fetchEngagements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost) return;
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tweetId: newPost }),
      });
      if (res.ok) {
        setNewPost("");
        fetchPosts();
        fetchEngagements();
      } else {
        const error = await res.json();
        alert(`Error: ${error.error || "Unknown"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add post");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Delete post and all engagements?")) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPosts();
        fetchEngagements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefreshPost = async (tweetId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tweetId }),
      });
      if (res.ok) {
        fetchPosts();
        fetchEngagements();
      } else {
        const error = await res.json();
        alert(`Error: ${error.error || "Unknown"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to refresh post");
    } finally {
      setLoading(false);
    }
  };

  const getPostEngagementCount = (postId: string) => {
    return engagements.filter((e: any) => e.postId === postId).length;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-['Inter',sans-serif] p-6 sm:p-12">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="border-b border-border pb-6">
          <h1 className="text-2xl font-bold tracking-tight">Admin Console</h1>
          <p className="text-sm text-muted-foreground mt-1">Precise control over tracking and members.</p>
        </div>

        {/* Section 1 — Add Member */}
        <section className="space-y-6 bg-card rounded-3xl border border-border p-6 sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Members</h2>
            <p className="text-sm text-muted-foreground">Manage operators in the engagement pool.</p>
          </div>

          <form onSubmit={handleAddMember} className="flex gap-3">
            <input
              type="text"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              placeholder="Username (no @)"
              className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500/50 transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-muted border border-border hover:bg-border hover:border-blue-500/50 text-foreground rounded-xl px-6 py-2 text-sm font-medium transition-all"
            >
              Fetch & Save
            </button>
          </form>

          <div className="flex flex-col gap-3">
            {members.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between border border-border bg-background/50 rounded-2xl p-4 transition-all hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name || "Member"} />
                    <AvatarFallback className="bg-muted text-foreground">
                      {(member.name || member.username || "M").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">{member.name || member.username}</span>
                    <span className="text-xs text-muted-foreground">@{member.twitterUsername || member.username}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-muted-foreground font-['JetBrains_Mono',monospace] bg-card px-2 py-1 rounded border border-border">
                    {member.twitterId || "Pending"}
                  </span>
                  <button
                    onClick={() => handleDeleteMember(member._id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-2"
                    title="Delete Member"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {members.length === 0 && (
              <div className="text-center text-muted-foreground py-4 text-sm border border-dashed border-border rounded-2xl">
                No members found.
              </div>
            )}
          </div>
        </section>

        {/* Section 2 — Add Post */}
        <section className="space-y-6 bg-card rounded-3xl border border-border p-6 sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Posts</h2>
            <p className="text-sm text-muted-foreground">Track engagement signals.</p>
          </div>

          <form onSubmit={handleAddPost} className="flex gap-3">
            <input
              type="text"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Tweet ID"
              className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500/50 transition-colors font-['JetBrains_Mono',monospace]"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-muted border border-border hover:bg-border hover:border-blue-500/50 text-foreground rounded-xl px-6 py-2 text-sm font-medium transition-all"
            >
              Fetch & Save
            </button>
          </form>

          <div className="flex flex-col gap-3">
            {posts.map((post) => {
              const engCount = getPostEngagementCount(post._id);
              return (
                <div
                  key={post._id}
                  className="flex items-center justify-between border border-border bg-background/50 rounded-2xl p-4 transition-all hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                      <AvatarFallback className="bg-muted text-foreground">
                        {(post.authorName || "P").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground font-['JetBrains_Mono',monospace] mb-1">
                        {post.tweetId}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{post.authorName}</span>
                        <span className="text-xs text-muted-foreground">@{post.authorUsername}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Engaged</span>
                      <span className="text-sm text-blue-500 font-['JetBrains_Mono',monospace] bg-card px-2 py-0.5 rounded border border-border">
                        {engCount}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRefreshPost(post.tweetId)}
                        className="text-muted-foreground hover:text-blue-500 transition-colors p-2"
                        title="Refresh Engagements"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-2"
                        title="Delete Post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {posts.length === 0 && (
              <div className="text-center text-muted-foreground py-4 text-sm border border-dashed border-border rounded-2xl">
                No signals tracking.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
