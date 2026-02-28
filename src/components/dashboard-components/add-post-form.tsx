"use client";

import { useState } from "react";

import { useMutation } from "convex/react";
import { ExternalLink, Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";

interface AddPostFormProps {
  hasTwitterLinked: boolean;
  twitterUsername?: string;
}

function extractTweetId(url: string): string | null {
  const match = url.match(/\/status\/(\d+)/);
  return match ? match[1] : null;
}

const WEBSITE_API = process.env.NEXT_PUBLIC_WEBSITE_SIGNING_KEY ?? "";

export function AddPostForm({
  hasTwitterLinked,
  twitterUsername,
}: AddPostFormProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setPostStatus = useMutation(api.dashboard.setPostStatus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tweetId = extractTweetId(url.trim());
    if (!tweetId) {
      toast.error("Invalid URL — paste a full X/Twitter post link");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Fetch & save tweet data via existing API
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": WEBSITE_API,
        },
        body: JSON.stringify({ tweetId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to fetch post data");
      }

      // 2. Assign status (published or queued) via Convex mutation
      const result = await setPostStatus({ tweetId });

      if (result.error) {
        throw new Error(result.error.message);
      }

      const status = result.data?.status;
      if (status === "queued") {
        toast.success("Post added to queue — will publish tomorrow");
      } else {
        toast.success("Post published to the feed!");
      }

      setUrl("");
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasTwitterLinked) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-dashed border-white/10 p-5 text-sm text-[#8B98A5]">
        <Link2 className="size-4 shrink-0" />
        <span>Link your Twitter account to share posts to the feed.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label
            htmlFor="post-url"
            className="text-xs tracking-wider text-[#8B98A5] uppercase"
          >
            Share a Post
          </Label>
          <div className="flex gap-2">
            <Input
              id="post-url"
              placeholder="https://x.com/username/status/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              className="flex-1 border-[#242C38] bg-[#151A22] font-[JetBrains_Mono,monospace] text-sm text-[#E6EDF3] placeholder:text-[#8B98A5]/50 focus-visible:border-[#4C8DFF]/50"
            />
            <Button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="shrink-0 border-0 bg-[#4C8DFF] text-white transition-transform hover:scale-[1.02] hover:bg-[#4C8DFF]/90"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <ExternalLink className="mr-2 size-4" />
                  Add Post
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      <p className="text-xs text-[#8B98A5]/60">
        Posting as{" "}
        <span className="font-[JetBrains_Mono,monospace] text-[#4C8DFF]">
          @{twitterUsername}
        </span>
        {" · "}One post per day - extras go to queue
      </p>
    </form>
  );
}
