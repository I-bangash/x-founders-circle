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
  const [manualUser, setManualUser] = useState("");
  const [manualTweets, setManualTweets] = useState("");
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

  const handleManualEngagement = async (action: "add" | "remove") => {
    if (!manualUser || !manualTweets) return;
    setLoading(true);
    try {
      const res = await fetch("/api/manual-engagements", {
        method: action === "add" ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          twitterUsername: manualUser,
          tweetIds: manualTweets,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(
          `Successfully ${action === "add" ? "added" : "removed"} ${data.count} engagement(s).`
        );
        setManualUser("");
        setManualTweets("");
        fetchMembers();
        fetchPosts();
        fetchEngagements();
      } else {
        const error = await res.json();
        alert(`Error: ${error.error || "Unknown"}`);
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} manual engagement`);
    } finally {
      setLoading(false);
    }
  };

  const getPostEngagementCount = (postId: string) => {
    return engagements.filter((e: any) => e.postId === postId).length;
  };

  return (
    <div className="bg-background text-foreground min-h-screen p-6 font-['Inter',sans-serif] sm:p-12">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="border-border border-b pb-6">
          <h1 className="text-2xl font-bold tracking-tight">Admin Console</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Precise control over tracking and members.
          </p>
        </div>

        {/* Section 1 — Add Member */}
        <section className="bg-card border-border space-y-6 rounded-3xl border p-6 sm:p-8">
          <div>
            <h2 className="text-foreground text-lg font-semibold">Members</h2>
            <p className="text-muted-foreground text-sm">
              Manage operators in the engagement pool.
            </p>
          </div>

          <form onSubmit={handleAddMember} className="flex gap-3">
            <input
              type="text"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              placeholder="Username (no @)"
              className="bg-background border-border text-foreground flex-1 rounded-xl border px-4 py-2 text-sm transition-colors focus:border-blue-500/50 focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-muted border-border hover:bg-border text-foreground rounded-xl border px-6 py-2 text-sm font-medium transition-all hover:border-blue-500/50"
            >
              Fetch & Save
            </button>
          </form>

          <div className="flex flex-col gap-3">
            {members.map((member) => (
              <div
                key={member._id}
                className="border-border bg-background/50 hover:bg-muted/50 flex items-center justify-between rounded-2xl border p-4 transition-all"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="border-border h-10 w-10 border">
                    <AvatarImage
                      src={member.image || "/placeholder.svg"}
                      alt={member.name || "Member"}
                    />
                    <AvatarFallback className="bg-muted text-foreground">
                      {(member.name || member.username || "M")
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-foreground text-sm font-semibold">
                      {member.name || member.username}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      @{member.twitterUsername || member.username}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-muted-foreground bg-card border-border rounded border px-2 py-1 font-['JetBrains_Mono',monospace] text-xs">
                    {member.twitterId || "Pending"}
                  </span>
                  <button
                    onClick={() => handleDeleteMember(member._id)}
                    className="text-muted-foreground hover:text-destructive p-2 transition-colors"
                    title="Delete Member"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {members.length === 0 && (
              <div className="text-muted-foreground border-border rounded-2xl border border-dashed py-4 text-center text-sm">
                No members found.
              </div>
            )}
          </div>
        </section>

        {/* Section 2 — Add Post */}
        <section className="bg-card border-border space-y-6 rounded-3xl border p-6 sm:p-8">
          <div>
            <h2 className="text-foreground text-lg font-semibold">Posts</h2>
            <p className="text-muted-foreground text-sm">
              Track engagement signals.
            </p>
          </div>

          <form onSubmit={handleAddPost} className="flex gap-3">
            <input
              type="text"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Tweet ID"
              className="bg-background border-border text-foreground flex-1 rounded-xl border px-4 py-2 font-['JetBrains_Mono',monospace] text-sm transition-colors focus:border-blue-500/50 focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-muted border-border hover:bg-border text-foreground rounded-xl border px-6 py-2 text-sm font-medium transition-all hover:border-blue-500/50"
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
                  className="border-border bg-background/50 hover:bg-muted/50 flex items-center justify-between rounded-2xl border p-4 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="border-border h-10 w-10 border">
                      <AvatarImage
                        src={post.authorAvatar}
                        alt={post.authorName}
                      />
                      <AvatarFallback className="bg-muted text-foreground">
                        {(post.authorName || "P").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground mb-1 font-['JetBrains_Mono',monospace] text-xs">
                        {post.tweetId}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground text-sm font-semibold">
                          {post.authorName}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          @{post.authorUsername}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                        Engaged
                      </span>
                      <span className="bg-card border-border rounded border px-2 py-0.5 font-['JetBrains_Mono',monospace] text-sm text-blue-500">
                        {engCount}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRefreshPost(post.tweetId)}
                        className="text-muted-foreground p-2 transition-colors hover:text-blue-500"
                        title="Refresh Engagements"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="text-muted-foreground hover:text-destructive p-2 transition-colors"
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
              <div className="text-muted-foreground border-border rounded-2xl border border-dashed py-4 text-center text-sm">
                No signals tracking.
              </div>
            )}
          </div>
        </section>

        {/* Section 3 — Manual Engagements */}
        <section className="bg-card border-border space-y-6 rounded-3xl border p-6 sm:p-8">
          <div>
            <h2 className="text-foreground text-lg font-semibold">
              Manual Engagements
            </h2>
            <p className="text-muted-foreground text-sm">
              Add or remove engagements manually for a user and post(s).
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleManualEngagement("add");
            }}
            className="flex flex-col gap-3"
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={manualUser}
                onChange={(e) => setManualUser(e.target.value)}
                placeholder="Username (no @)"
                className="bg-background border-border text-foreground w-1/3 rounded-xl border px-4 py-2 text-sm transition-colors focus:border-blue-500/50 focus:outline-none"
                disabled={loading}
              />
              <input
                type="text"
                value={manualTweets}
                onChange={(e) => setManualTweets(e.target.value)}
                placeholder="Tweet IDs (comma separated)"
                className="bg-background border-border text-foreground flex-1 rounded-xl border px-4 py-2 font-['JetBrains_Mono',monospace] text-sm transition-colors focus:border-blue-500/50 focus:outline-none"
                disabled={loading}
              />
            </div>
            <div className="mt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => handleManualEngagement("remove")}
                disabled={loading || !manualUser || !manualTweets}
                className="bg-destructive/10 border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-xl border px-6 py-2 text-sm font-medium shadow-sm transition-all"
              >
                Remove Engagement
              </button>
              <button
                type="submit"
                disabled={loading || !manualUser || !manualTweets}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-2 text-sm font-medium transition-all"
              >
                Add Engagement
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
