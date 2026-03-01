"use client";

import { useMemo, useState } from "react";

import { useQuery } from "convex/react";

import { AddPostForm } from "@/components/dashboard-components/add-post-form";
import { ChartAreaInteractive } from "@/components/dashboard-components/chart-area-interactive";
import { ContributionGraph } from "@/components/dashboard-components/contribution-graph";
import { DataTable } from "@/components/dashboard-components/data-table";
import type { PostSchemaType } from "@/components/dashboard-components/data-table-schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";

export default function DashboardPage() {
  const userResult = useQuery(api.dashboard.getCurrentUser);
  const postsResult = useQuery(api.dashboard.getMyPosts);
  const chartResult = useQuery(api.dashboard.getMyChartData, { days: 90 });
  const contributionResult = useQuery(api.dashboard.getMyContributionGraph);

  const currentUser = userResult?.data ?? null;
  const chartData = chartResult?.data ?? [];

  // --- TEMPORARY DUMMY DATA FOR CONTRIBUTION GRAPH ---
  const dummyContributionData = useMemo(() => {
    const dummy: { date: string; count: number }[] = [];
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      // Use deterministic pseudo-random values based on 'i' to prevent hydration mismatch!
      const rand = ((i * 29) % 100) / 100;
      let count = 0;

      // Force a realistic streak for testing!
      // Set to 4 for a 5-day streak (0 to 4 is 5 days)
      if (i <= 20) {
        count = (i % 4) + 2;
      } else {
        // Weighting random numbers so it looks realistic
        if (rand > 0.6) count = (i % 3) + 1; // 1-3
        if (rand > 0.8) count = (i % 4) + 4; // 4-7
        if (rand > 0.92) count = (i % 5) + 8; // 8-12
      }

      if (count > 0) {
        dummy.push({
          date: d.toISOString().split("T")[0],
          count,
        });
      }
    }
    return dummy;
  }, []);

  const contributionData = dummyContributionData; // FIXME: Revert to: contributionResult?.data ?? [];

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
        <Tabs defaultValue="contributions" className="w-full">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-foreground text-xl font-bold tracking-tight">
              Activity
            </h2>
            <TabsList className="bg-card border-border flex h-auto items-center gap-0.5 rounded-full border p-0.5 sm:gap-1 sm:p-1">
              <TabsTrigger
                value="contributions"
                className="data-[state=active]:bg-muted/60 data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground hover:data-[state=inactive]:text-foreground rounded-full px-3 py-1 text-[10px] font-medium transition-all data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent sm:px-4 sm:py-1.5 sm:text-sm"
              >
                Contributions
              </TabsTrigger>
              <TabsTrigger
                value="engagements"
                className="data-[state=active]:bg-muted/60 data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground hover:data-[state=inactive]:text-foreground rounded-full px-3 py-1 text-[10px] font-medium transition-all data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent sm:px-4 sm:py-1.5 sm:text-sm"
              >
                Engagements
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="contributions"
            className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
          >
            <ContributionGraph
              data={contributionData}
              colorScheme="teal"
              squareSize={15}
            />
          </TabsContent>

          <TabsContent
            value="engagements"
            className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
          >
            <ChartAreaInteractive data={chartData} />
          </TabsContent>
        </Tabs>
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
