import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MetricCardData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  footerTitle: string;
  footerDescription: string;
}

const METRIC_CARDS: MetricCardData[] = [
  {
    title: "Total Revenue",
    value: "$1,250.00",
    change: "+12.5%",
    isPositive: true,
    footerTitle: "Trending up this month",
    footerDescription: "Visitors for the last 6 months",
  },
  {
    title: "New Customers",
    value: "1,234",
    change: "-20%",
    isPositive: false,
    footerTitle: "Down 20% this period",
    footerDescription: "Acquisition needs attention",
  },
  {
    title: "Active Accounts",
    value: "45,678",
    change: "+12.5%",
    isPositive: true,
    footerTitle: "Strong user retention",
    footerDescription: "Engagement exceed targets",
  },
  {
    title: "Growth Rate",
    value: "4.5%",
    change: "+4.5%",
    isPositive: true,
    footerTitle: "Steady performance increase",
    footerDescription: "Meets growth projections",
  },
];

function MetricCard({ data }: { data: MetricCardData }) {
  const TrendIcon = data.isPositive ? IconTrendingUp : IconTrendingDown;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{data.title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {data.value}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <TrendIcon />
            {data.change}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {data.footerTitle} <TrendIcon className="size-4" />
        </div>
        <div className="text-muted-foreground">{data.footerDescription}</div>
      </CardFooter>
    </Card>
  );
}

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {METRIC_CARDS.map((card) => (
        <MetricCard key={card.title} data={card} />
      ))}
    </div>
  );
}
