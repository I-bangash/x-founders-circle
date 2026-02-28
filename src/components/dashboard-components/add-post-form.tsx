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
      <div className="text-muted-foreground flex items-center gap-3 rounded-full border border-dashed p-4 px-5 text-sm">
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
            className="text-muted-foreground text-xs tracking-wider uppercase"
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
              className="placeholder:text-muted-foreground/50 flex-1 rounded-full font-[JetBrains_Mono,monospace] text-sm"
            />
            <Button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="shrink-0 rounded-full transition-transform hover:scale-[1.02]"
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
      <p className="text-muted-foreground/70 text-xs">
        Posting as{" "}
        <span className="text-primary font-[JetBrains_Mono,monospace]">
          @{twitterUsername}
        </span>
        {" · "}One post per day - extras go to queue
      </p>
    </form>
  );
}
