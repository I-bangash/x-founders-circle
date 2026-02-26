"use client";

import { useEffect, useState } from "react";

import { RefreshCw, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Doc } from "@/convex/_generated/dataModel";

export default function Dashboard() {
  const [members, setMembers] = useState<Doc<"users">[]>([]);
  const [posts, setPosts] = useState<Doc<"posts">[]>([]);
  const [newMember, setNewMember] = useState("");
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...prev,
    ]);
  };

  useEffect(() => {
    fetchMembers();
    fetchPosts();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members");
      if (res.ok) setMembers(await res.json());
    } catch (err) {
      addLog(`Error fetching members: ${err}`);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) setPosts(await res.json());
    } catch (err) {
      addLog(`Error fetching posts: ${err}`);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember) return;
    setLoading(true);
    addLog(`Adding member: ${newMember}`);
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newMember.replace("@", "") }),
      });
      addLog(`Add member response status: ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        addLog(`Success: Added member ${data.username}`);
        setNewMember("");
        fetchMembers();
      } else {
        const error = await res.json();
        addLog(`Error adding member: ${error.error || "Unknown"}`);
      }
    } catch (err) {
      console.error(err);
      addLog(`Exception adding member: ${err}`);
      alert("Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Are you sure? This will delete all their engagements."))
      return;
    addLog(`Deleting member ${id}`);
    try {
      const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
      if (res.ok) {
        addLog(`Success: Deleted member ${id}`);
        fetchMembers();
      } else {
        addLog(`Error deleting member: ${res.statusText}`);
      }
    } catch (err) {
      addLog(`Exception deleting member: ${err}`);
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost) return;
    setLoading(true);
    addLog(`Adding post: ${newPost}`);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tweetId: newPost }),
      });
      addLog(`Add post response status: ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        addLog(`Success: Added post ${data.post?.tweetId}`);
        setNewPost("");
        fetchPosts();
      } else {
        const error = await res.json();
        addLog(`Error adding post: ${error.error || "Unknown"}`);
        if (error.debug) {
          addLog(`Debug: ${JSON.stringify(error.debug)}`);
        }
      }
    } catch (err) {
      console.error(err);
      addLog(`Exception adding post: ${err}`);
      alert("Failed to add post");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (
      !confirm("Are you sure? This will delete all engagements for this post.")
    )
      return;
    addLog(`Deleting post ${id}`);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        addLog(`Success: Deleted post ${id}`);
        fetchPosts();
      } else {
        addLog(`Error deleting post: ${res.statusText}`);
      }
    } catch (err) {
      addLog(`Exception deleting post: ${err}`);
    }
  };

  const handleRefreshPost = async (tweetId: string) => {
    setLoading(true);
    addLog(`Refreshing post: ${tweetId}`);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tweetId }),
      });
      addLog(`Refresh post response status: ${res.status}`);
      if (res.ok) {
        addLog(`Success: Refreshed post ${tweetId}`);
        fetchPosts();
      } else {
        const text = await res.text();
        addLog(`Error refreshing post: ${text}`);
      }
    } catch (err) {
      console.error(err);
      addLog(`Exception refreshing post: ${err}`);
      alert("Failed to refresh post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10 p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Members Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Members ({members.length})</h2>
        <form onSubmit={handleAddMember} className="flex gap-2">
          <Input
            type="text"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Twitter Username (e.g. elonmusk)"
            className="flex-1 dark:bg-zinc-900"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Add Member
          </Button>
        </form>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {members.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between rounded border p-3 dark:border-zinc-800"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={member.image || "/placeholder.svg"}
                    alt={member.name || "Member"}
                  />
                  <AvatarFallback>
                    {(member.name || member.username || "M")
                      .charAt(0)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold">{member.name}</div>
                  <div className="text-xs text-zinc-500">
                    @{member.username}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteMember(member._id || "")}
                className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Posts Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Posts ({posts.length})</h2>
        <form onSubmit={handleAddPost} className="flex gap-2">
          <Input
            type="text"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Tweet ID (e.g. 1234567890)"
            className="flex-1 dark:bg-zinc-900"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Add Post
          </Button>
        </form>

        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post._id}
              className="flex items-start justify-between rounded border p-4 dark:border-zinc-800"
            >
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                  <AvatarFallback>
                    {(post.authorName || "P").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold">
                    {post.authorName}{" "}
                    <span className="font-normal text-zinc-500">
                      @{post.authorUsername}
                    </span>
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm text-zinc-700 dark:text-zinc-300">
                    {post.content}
                  </div>
                  <div className="mt-2 text-xs text-zinc-500">
                    Added: {new Date(post.fetchedAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRefreshPost(post.tweetId)}
                  className="text-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950"
                  title="Refresh Engagements"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeletePost(post._id || "")}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                  title="Delete Post"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Logs Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Logs</h2>
        <div className="h-48 space-y-1 overflow-y-auto rounded-lg bg-zinc-100 p-4 font-mono text-xs dark:bg-zinc-900">
          {logs.length === 0 ? (
            <div className="text-zinc-500">No logs yet...</div>
          ) : (
            logs.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>
      </section>
    </div>
  );
}
