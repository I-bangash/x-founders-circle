"use client";

import { useEffect, useState } from "react";

import { Download, RefreshCw, Trash2, Upload } from "lucide-react";

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

  const [minAgeHrs, setMinAgeHrs] = useState("0");
  const [maxAgeHrs, setMaxAgeHrs] = useState("48");
  const [isBulkRefreshing, setIsBulkRefreshing] = useState(false);
  const [bulkRefreshProgress, setBulkRefreshProgress] = useState(0);
  const [bulkRefreshTotal, setBulkRefreshTotal] = useState(0);

  useEffect(() => {
    fetchMembers();
    fetchPosts();
    fetchEngagements();
  }, []);

  const websiteApi = process.env.NEXT_PUBLIC_WEBSITE_SIGNING_KEY ?? "";

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members", {
        headers: {
          "x-api-key": websiteApi,
        },
      });
      if (res.ok) setMembers(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts", {
        headers: {
          "x-api-key": websiteApi,
        },
      });
      if (res.ok) setPosts(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  // Optional: fetch engagements to show counts
  const fetchEngagements = async () => {
    try {
      const res = await fetch("/api/engagements", {
        headers: {
          "x-api-key": websiteApi,
        },
      });
      if (res.ok) setEngagements(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportMembers = () => {
    const usernames = members.map((m) => m.twitterUsername).join("\n");
    const blob = new Blob([usernames], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `members_backup_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportMembers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setNewMember(text);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExportPosts = () => {
    const ids = posts.map((p) => p.tweetId).join("\n");
    const blob = new Blob([ids], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `posts_backup_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportPosts = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setNewPost(text);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember) return;

    const rawNames = newMember.split(/[\n,]+/).map((n) => n.trim()).filter(Boolean);
    if (rawNames.length === 0) return;

    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    for (const rawName of rawNames) {
      let parsedUsername = rawName;
      if (parsedUsername.includes("x.com/") || parsedUsername.includes("twitter.com/")) {
        // Extract username from URL (e.g., https://x.com/username or https://twitter.com/username)
        const parts = parsedUsername.split("/");
        parsedUsername = parts[parts.length - 1].split("?")[0];
      }
      parsedUsername = parsedUsername.replace("@", "");

      try {
        const res = await fetch("/api/members", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": websiteApi,
          },
          body: JSON.stringify({ username: parsedUsername }),
        });
        if (res.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        console.error(err);
        failCount++;
      }
    }

    setNewMember("");
    fetchMembers();
    setLoading(false);

    if (rawNames.length > 1) {
      alert(`Bulk add complete.\nSuccess: ${successCount}\nFailed: ${failCount}`);
    } else if (failCount > 0) {
      alert("Failed to add member");
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Delete member and all engagements?")) return;
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: "DELETE",
        headers: { "x-api-key": websiteApi },
      });
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

    const rawIds = newPost.split(/[\n,]+/).map((id) => id.trim()).filter(Boolean);
    if (rawIds.length === 0) return;

    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    for (const rawId of rawIds) {
      let parsedTweetId = rawId;
      if (parsedTweetId.includes("status/")) {
        parsedTweetId = parsedTweetId.split("status/")[1].split("?")[0];
      } else if (parsedTweetId.startsWith("http")) {
        parsedTweetId = parsedTweetId.split("/").pop()?.split("?")[0] || parsedTweetId;
      }

      try {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": websiteApi,
          },
          body: JSON.stringify({ tweetId: parsedTweetId }),
        });
        if (res.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        console.error(err);
        failCount++;
      }
    }

    setNewPost("");
    fetchPosts();
    fetchEngagements();
    setLoading(false);

    if (rawIds.length > 1) {
      alert(`Bulk add complete.\nSuccess: ${successCount}\nFailed: ${failCount}`);
    } else if (failCount > 0) {
      alert("Failed to add post");
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Delete post and all engagements?")) return;
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: { "x-api-key": websiteApi },
      });
      if (res.ok) {
        fetchPosts();
        fetchEngagements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkRefresh = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBulkRefreshing) return;

    const minHrs = parseFloat(minAgeHrs) || 0;
    const maxHrs = parseFloat(maxAgeHrs) || 48;

    const now = Date.now();

    const postsToUpdate = posts.filter((post) => {
      // @ts-ignore - _creationTime exists on convex documents, createdAt is our custom field
      const postTime = post.createdAt || post._creationTime;
      const ageInHrs = (now - postTime) / (1000 * 60 * 60);
      return ageInHrs >= minHrs && ageInHrs <= maxHrs;
    });

    if (postsToUpdate.length === 0) {
      alert("No posts found in this time range.");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to refetch ${postsToUpdate.length} posts?`
      )
    )
      return;

    setIsBulkRefreshing(true);
    setBulkRefreshTotal(postsToUpdate.length);
    setBulkRefreshProgress(0);

    let successCount = 0;
    let failCount = 0;

    for (const post of postsToUpdate) {
      try {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": websiteApi,
          },
          body: JSON.stringify({ tweetId: post.tweetId }),
        });
        if (res.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        console.error("Failed to refresh post", post.tweetId, err);
        failCount++;
      }
      setBulkRefreshProgress((prev) => prev + 1);
      // Wait a bit to avoid hitting rate limits too fast
      await new Promise((r) => setTimeout(r, 1000));
    }

    setIsBulkRefreshing(false);
    alert(
      `Bulk refresh complete.\nSuccess: ${successCount}\nFailed: ${failCount}`
    );

    fetchPosts();
    fetchEngagements();
  };

  const handleRefreshPost = async (tweetId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": websiteApi,
        },
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

    const parsedTweetIds = manualTweets
      .split(",")
      .map((t) => {
        let tid = t.trim();
        if (tid.includes("status/")) {
          return tid.split("status/")[1].split("?")[0];
        }
        if (tid.startsWith("http")) {
          return tid.split("/").pop()?.split("?")[0] || tid;
        }
        return tid;
      })
      .filter(Boolean)
      .join(",");

    setLoading(true);
    try {
      const res = await fetch("/api/manual-engagements", {
        method: action === "add" ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": websiteApi,
        },
        body: JSON.stringify({
          twitterUsername: manualUser,
          tweetIds: parsedTweetIds,
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
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-foreground text-lg font-semibold">Members</h2>
              <p className="text-muted-foreground text-sm">
                Manage operators in the engagement pool.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label
                className="bg-muted border-border hover:bg-border text-foreground flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium transition-all"
                title="Import from TXT/CSV"
              >
                <Upload className="h-4 w-4" />
                <span>Import</span>
                <input
                  type="file"
                  accept=".txt,.csv"
                  className="hidden"
                  onChange={handleImportMembers}
                />
              </label>
              <button
                type="button"
                onClick={handleExportMembers}
                className="bg-muted border-border hover:bg-border text-foreground flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium transition-all"
                title="Export to TXT"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleAddMember} className="flex gap-3">
            <textarea
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              placeholder="Usernames or URLs (comma or newline separated)"
              rows={2}
              className="bg-background border-border text-foreground flex-1 resize-none rounded-xl border px-4 py-2 font-['JetBrains_Mono',monospace] text-sm transition-colors focus:border-blue-500/50 focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-muted border-border hover:bg-border text-foreground h-fit rounded-xl border px-6 py-2 text-sm font-medium transition-all hover:border-blue-500/50"
            >
              Fetch & Save
            </button>
          </form>

          <div className="flex max-h-[400px] flex-col gap-3 overflow-y-auto pr-2">
            {members.map((member) => (
              <div
                key={member._id}
                className="border-border bg-background/50 hover:bg-muted/50 flex items-center justify-between rounded-2xl border p-4 transition-all"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="border-border h-10 w-10 border">
                    <AvatarImage
                      src={member.image || "/placeholder.svg"}
                      alt={member.twitterName || "Member"}
                    />
                    <AvatarFallback className="bg-muted text-foreground">
                      {(member.twitterName || member.twitterUsername || "M")
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-foreground text-sm font-semibold">
                      {member.twitterName || member.twitterUsername}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      @{member.twitterUsername || member.twitterUsername}
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
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-foreground text-lg font-semibold">Posts</h2>
              <p className="text-muted-foreground text-sm">
                Track engagement signals.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label
                className="bg-muted border-border hover:bg-border text-foreground flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium transition-all"
                title="Import from TXT/CSV"
              >
                <Upload className="h-4 w-4" />
                <span>Import</span>
                <input
                  type="file"
                  accept=".txt,.csv"
                  className="hidden"
                  onChange={handleImportPosts}
                />
              </label>
              <button
                type="button"
                onClick={handleExportPosts}
                className="bg-muted border-border hover:bg-border text-foreground flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium transition-all"
                title="Export to TXT"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleAddPost} className="flex gap-3">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Tweet IDs or URLs (comma or newline separated)"
              rows={2}
              className="bg-background border-border text-foreground flex-1 resize-none rounded-xl border px-4 py-2 font-['JetBrains_Mono',monospace] text-sm transition-colors focus:border-blue-500/50 focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-muted border-border hover:bg-border text-foreground h-fit rounded-xl border px-6 py-2 text-sm font-medium transition-all hover:border-blue-500/50"
            >
              Fetch & Save
            </button>
          </form>

          <div className="flex max-h-[500px] flex-col gap-3 overflow-y-auto pr-2">
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

        {/* Section 3 — Bulk Refetch Posts */}
        <section className="bg-card border-border space-y-6 rounded-3xl border p-6 sm:p-8">
          <div>
            <h2 className="text-foreground text-lg font-semibold">
              Bulk Refetch
            </h2>
            <p className="text-muted-foreground text-sm">
              Refetch posts within a specific age range to update engagements.
            </p>
          </div>

          <form onSubmit={handleBulkRefresh} className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-muted-foreground text-xs tracking-wider uppercase">
                  Min Age (Hours)
                </label>
                <input
                  type="number"
                  min="0"
                  value={minAgeHrs}
                  onChange={(e) => setMinAgeHrs(e.target.value)}
                  placeholder="e.g. 0"
                  className="bg-background border-border text-foreground rounded-xl border px-4 py-2 text-sm transition-colors focus:border-blue-500/50 focus:outline-none"
                  disabled={isBulkRefreshing}
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-muted-foreground text-xs tracking-wider uppercase">
                  Max Age (Hours)
                </label>
                <input
                  type="number"
                  min="0"
                  value={maxAgeHrs}
                  onChange={(e) => setMaxAgeHrs(e.target.value)}
                  placeholder="e.g. 48"
                  className="bg-background border-border text-foreground rounded-xl border px-4 py-2 text-sm transition-colors focus:border-blue-500/50 focus:outline-none"
                  disabled={isBulkRefreshing}
                />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-muted-foreground text-sm">
                {isBulkRefreshing
                  ? `Refreshing... ${bulkRefreshProgress} / ${bulkRefreshTotal}`
                  : "Refetching adds a 1-second delay between posts."}
              </div>
              <button
                type="submit"
                disabled={isBulkRefreshing}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-2 text-sm font-medium transition-all disabled:opacity-50"
              >
                {isBulkRefreshing ? "In Progress..." : "Run Bulk Refetch"}
              </button>
            </div>
          </form>
        </section>

        {/* Section 4 — Manual Engagements */}
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
