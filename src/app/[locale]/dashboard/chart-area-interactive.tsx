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

import { chartData } from "./chart-data";

export const description = "An interactive area chart";

const TIME_RANGES = [
  { value: "90d", label: "Last 3 months", days: 90 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "7d", label: "Last 7 days", days: 7 },
] as const;

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const filterData = (data: typeof chartData, timeRange: string) => {
  const referenceDate = new Date("2024-06-30");
  const daysToSubtract =
    TIME_RANGES.find((r) => r.value === timeRange)?.days || 90;

  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - daysToSubtract);

  return data.filter((item) => new Date(item.date) >= startDate);
};

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
      <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={1.0} />
        <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
      </linearGradient>
      <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
        <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
      </linearGradient>
    </defs>
  );
}

function InteractiveAreaChart({
  data,
  isMobile,
}: {
  data: typeof chartData;
  isMobile: boolean;
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[250px] w-full"
    >
      <AreaChart data={data}>
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
            <ChartTooltipContent labelFormatter={formatDate} indicator="dot" />
          }
        />
        <Area
          dataKey="mobile"
          type="natural"
          fill="url(#fillMobile)"
          stroke="var(--color-mobile)"
          stackId="a"
        />
        <Area
          dataKey="desktop"
          type="natural"
          fill="url(#fillDesktop)"
          stroke="var(--color-desktop)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  // Automatically switch to smaller range on mobile
  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = React.useMemo(
    () => filterData(chartData, timeRange),
    [timeRange]
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <InteractiveAreaChart data={filteredData} isMobile={isMobile} />
      </CardContent>
    </Card>
  );
}
