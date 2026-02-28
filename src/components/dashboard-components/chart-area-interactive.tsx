"use client";

import * as React from "react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";

export const description = "Posts shared and engagements received per day";

const TIME_RANGES = [
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "90d", label: "Last 3 months", days: 90 },
] as const;

const chartConfig = {
  postsShared: {
    label: "Posts Shared",
    color: "var(--primary)",
  },
  engagementReceived: {
    label: "Engagement Received",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

interface ChartDataPoint {
  date: string;
  postsShared: number;
  engagementReceived: number;
}

interface ChartAreaInteractiveProps {
  data: ChartDataPoint[];
}

function TimeRangeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={onChange}
        variant="outline"
        className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
      >
        {TIME_RANGES.map((range) => (
          <ToggleGroupItem key={range.value} value={range.value}>
            {range.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
          size="sm"
          aria-label="Select a value"
        >
          <SelectValue placeholder="Last 3 months" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          {TIME_RANGES.map((range) => (
            <SelectItem
              key={range.value}
              value={range.value}
              className="rounded-lg"
            >
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}

function ChartGradients() {
  return (
    <defs>
      <linearGradient id="fillPostsShared" x1="0" y1="0" x2="0" y2="1">
        <stop
          offset="5%"
          stopColor="var(--color-postsShared)"
          stopOpacity={1.0}
        />
        <stop
          offset="95%"
          stopColor="var(--color-postsShared)"
          stopOpacity={0.1}
        />
      </linearGradient>
      <linearGradient id="fillEngagementReceived" x1="0" y1="0" x2="0" y2="1">
        <stop
          offset="5%"
          stopColor="var(--color-engagementReceived)"
          stopOpacity={0.8}
        />
        <stop
          offset="95%"
          stopColor="var(--color-engagementReceived)"
          stopOpacity={0.1}
        />
      </linearGradient>
    </defs>
  );
}

function filterByRange(
  data: ChartDataPoint[],
  timeRange: string
): ChartDataPoint[] {
  const days = TIME_RANGES.find((r) => r.value === timeRange)?.days ?? 90;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  return data.filter((d) => d.date >= cutoffStr);
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d");
  }, [isMobile]);

  const filtered = React.useMemo(
    () => filterByRange(data, timeRange),
    [data, timeRange]
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Posts shared and engagements received
          </span>
          <span className="@[540px]/card:hidden">Activity</span>
        </CardDescription>
        <CardAction>
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filtered.length === 0 ? (
          <div className="text-muted-foreground flex h-[250px] items-center justify-center text-sm">
            No data yet — share your first post to see activity
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filtered}>
              <ChartGradients />
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={formatDate}
              />
              <ChartTooltip
                cursor={false}
                defaultIndex={isMobile ? -1 : 10}
                content={
                  <ChartTooltipContent
                    labelFormatter={formatDate}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="engagementReceived"
                type="natural"
                fill="url(#fillEngagementReceived)"
                stroke="var(--color-engagementReceived)"
                stackId="a"
              />
              <Area
                dataKey="postsShared"
                type="natural"
                fill="url(#fillPostsShared)"
                stroke="var(--color-postsShared)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
