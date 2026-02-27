"use client";

import { useQuery } from "convex/react";

import { AddPostForm } from "@/components/dashboard-components/add-post-form";
import { ChartAreaInteractive } from "@/components/dashboard-components/chart-area-interactive";
import { DataTable } from "@/components/dashboard-components/data-table";
import type { PostSchemaType } from "@/components/dashboard-components/data-table-schema";
import { api } from "@/convex/_generated/api";

export default function DashboardPage() {
  const userResult = useQuery(api.dashboard.getCurrentUser);
  const postsResult = useQuery(api.dashboard.getMyPosts);
  const chartResult = useQuery(api.dashboard.getMyChartData, { days: 90 });

  const currentUser = userResult?.data ?? null;
  const chartData = chartResult?.data ?? [];

  const posts: PostSchemaType[] = (postsResult?.data ?? []).map((p: any) => ({
    id: p._id,
    tweetId: p.tweetId,
    content: p.content,
    createdAt: p.createdAt,
    status: p.status,
    engagementCount: p.engagementCount ?? 0,
    authorUsername: p.authorUsername,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive data={chartData} />
      </div>

      <div className="px-4 lg:px-6">
        <AddPostForm
          hasTwitterLinked={!!currentUser?.twitterId}
          twitterUsername={currentUser?.twitterUsername ?? undefined}
        />
      </div>

      <DataTable data={posts} />
    </div>
  );
}
