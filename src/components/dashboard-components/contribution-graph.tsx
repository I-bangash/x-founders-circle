"use client";

import * as React from "react";

import { addDays, format, startOfWeek, subDays } from "date-fns";

import { THEMES } from "@/components/dashboard-components/color-themes";
import { FireIcon } from "@/components/icons/fire-icon";
import { ParticlesColorFire } from "@/components/particles-color-fire";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { interpolateFlameConfig, particleFlames } from "@/lib/utils";

interface ContributionGraphProps {
  data: { date: string; count: number }[];
  colorScheme?: keyof typeof THEMES;
  squareSize?: number;
}

export function ContributionGraph({
  data,
  colorScheme = "emerald",
  squareSize = 14,
}: ContributionGraphProps) {
  const { transposedData, weeks, monthLabels, currentStreak } =
    React.useMemo(() => {
      // Map data to a fast lookup
      const dataMap = new Map(data.map((d) => [d.date, d.count]));

      // Generate last 365 days
      // Strip time to avoid hydration mismatches / unnecessary recalculations across millisecond changes
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = subDays(today, 365);

      // To match github graph, we start from the Sunday of the week 365 days ago
      const graphStartDate = startOfWeek(startDate, { weekStartsOn: 0 });

      const weeks: { date: Date; count: number }[][] = [];
      let currentWeek: { date: Date; count: number }[] = [];

      let iterDate = graphStartDate;
      while (iterDate <= today || currentWeek.length > 0) {
        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }

        if (iterDate > today && currentWeek.length === 0) {
          break;
        }

        if (iterDate <= today) {
          const dateStr = format(iterDate, "yyyy-MM-dd");
          currentWeek.push({
            date: iterDate,
            count: dataMap.get(dateStr) || 0,
          });
        } else {
          // pad the last week with null-like items if needed
          currentWeek.push({
            date: iterDate,
            count: -1, // representing future days in the last week
          });
        }

        iterDate = addDays(iterDate, 1);
      }
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }

      // Transpose the data so rows are days of the week and columns are weeks
      // This helps make it fully responsive and fill the container better
      const days = Array(7).fill(null);
      const transposedData = days.map((_, dayIndex) =>
        weeks.map((week) => week[dayIndex])
      );

      const getMonthLabels = () => {
        const labels: { label: string; colIndex: number }[] = [];
        let lastMonth = -1;

        weeks.forEach((week, i) => {
          // Find the first valid day in the week
          const firstDayOfWeek = week.find((d) => d && d.count !== -1)?.date;
          if (!firstDayOfWeek) return;

          const month = firstDayOfWeek.getMonth();
          if (month !== lastMonth && firstDayOfWeek.getDate() <= 14) {
            labels.push({ label: format(firstDayOfWeek, "MMM"), colIndex: i });
            lastMonth = month;
          }
        });

        return labels;
      };

      const monthLabels = getMonthLabels();

      // --- Calculate Current Streak ---
      const calculateStreak = () => {
        let streak = 0;
        const todayStr = format(today, "yyyy-MM-dd");
        const yesterday = subDays(today, 1);
        const yesterdayStr = format(yesterday, "yyyy-MM-dd");

        // Start checking from today, or yesterday if today has no contributions yet
        let checkDate =
          dataMap.get(todayStr) && dataMap.get(todayStr)! > 0
            ? today
            : yesterday;

        // Quick early exit if neither today nor yesterday has a contribution
        if (
          (!dataMap.get(todayStr) || dataMap.get(todayStr) === 0) &&
          (!dataMap.get(yesterdayStr) || dataMap.get(yesterdayStr) === 0)
        ) {
          return 0;
        }

        while (true) {
          const dateStr = format(checkDate, "yyyy-MM-dd");
          const count = dataMap.get(dateStr) || 0;

          if (count > 0) {
            streak++;
            checkDate = subDays(checkDate, 1);
          } else {
            break;
          }
        }

        return streak;
      };

      const currentStreak = calculateStreak();

      return { transposedData, weeks, monthLabels, currentStreak };
    }, [data]);

  const colors = THEMES[colorScheme];

  const getIntensity = (count: number) => {
    if (count === -1) return "bg-transparent"; // Future days
    if (count === 0) return colors[0];
    if (count <= 3) return colors[1];
    if (count <= 6) return colors[2];
    if (count <= 9) return colors[3];
    return colors[4];
  };

  // Determine flame configuration based on streak intensity
  // The scale works roughly from 0 (tiny flame) to 1000 (massive fire) based on particleFlames mapping
  // A multiplier of 2.5 means a 44-day streak gives an intensity of ~110 (moderate flame).
  const streakFlameIntensity = Math.min(Math.max(currentStreak * 2.5, 0), 1000);
  const flameConfig = React.useMemo(
    () => interpolateFlameConfig(streakFlameIntensity, particleFlames),
    [streakFlameIntensity]
  );

  return (
    <div className="bg-card border-border @container flex flex-col rounded-[32px] border p-5 shadow-sm transition-all duration-500 sm:p-6">
      <div className="mb-6 flex flex-col gap-1.5">
        <h3 className="text-foreground text-lg font-semibold tracking-tight">
          Contribution Graph
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm sm:text-sm">
            <span className="sm:hidden">
              Daily tracking of your engagements
            </span>
            <span className="hidden sm:inline">
              Daily tracking of your engagements with other members
            </span>
          </p>

          {currentStreak >= 3 && (
            <div className="relative z-10 mr-2 flex items-center justify-center">
              <div className="pointer-events-none absolute top-[90%] left-1/2 z-0 h-[175px] w-[180px] -translate-x-1/2 -translate-y-1/2">
                <ParticlesColorFire
                  className="scale-80 overflow-visible opacity-100"
                  color="#ff4d4d"
                  {...flameConfig}
                  isFireEffect={true}
                />
                {/* Gradient overlay to fade the fire effect into the card background at the top */}
                <div className="from-card absolute inset-[15px] rounded-full bg-gradient-to-b to-transparent to-20% sm:inset-[7px]" />
              </div>
              <div className="from-background to-muted/50 relative z-10 flex shrink-0 items-center gap-1 rounded-full border border-orange-500/10 bg-gradient-to-b px-2 py-0.5 shadow-sm backdrop-blur-xl sm:gap-1.5 sm:px-3 sm:py-1">
                <FireIcon className="h-3 w-3 text-orange-500 sm:h-3.5 sm:w-3.5" />
                <span className="text-foreground/90 text-[10px] font-semibold tracking-tight whitespace-nowrap sm:text-xs">
                  {currentStreak} Day Streak
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full items-center justify-center overflow-hidden">
        <div className="md:hide-scrollbar w-full min-w-0 overflow-x-auto pb-4 md:overflow-visible">
          <div className="mx-auto flex min-w-max flex-col gap-2">
            {/* Month Labels */}
            <div className="text-muted-foreground relative ml-[32px] flex h-4 w-full text-xs">
              {monthLabels.map((m, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `calc(${m.colIndex} * (100% / ${weeks.length}))`,
                  }}
                >
                  {m.label}
                </div>
              ))}
            </div>

            <div className="flex w-full gap-3">
              {/* Day Labels */}
              <div
                className="text-muted-foreground flex h-full shrink-0 flex-col justify-between py-[2px] text-[10px]"
                style={{ minHeight: `${7 * squareSize + 6 * 4}px` }}
              >
                <span
                  className="flex items-center leading-none"
                  style={{ height: `${squareSize}px` }}
                ></span>
                <span
                  className="flex items-center leading-none"
                  style={{ height: `${squareSize}px` }}
                >
                  Mon
                </span>
                <span
                  className="flex items-center leading-none"
                  style={{ height: `${squareSize}px` }}
                ></span>
                <span
                  className="flex items-center leading-none"
                  style={{ height: `${squareSize}px` }}
                >
                  Wed
                </span>
                <span
                  className="flex items-center leading-none"
                  style={{ height: `${squareSize}px` }}
                ></span>
                <span
                  className="flex items-center leading-none"
                  style={{ height: `${squareSize}px` }}
                >
                  Fri
                </span>
                <span
                  className="flex items-center leading-none"
                  style={{ height: `${squareSize}px` }}
                ></span>
              </div>

              {/* Grid */}
              <TooltipProvider delayDuration={100}>
                <div className="flex flex-1 flex-col justify-between gap-[4px]">
                  {transposedData.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="flex w-full justify-between gap-[4px]"
                    >
                      {row.map((day, colIndex) => (
                        <div
                          key={colIndex}
                          className="flex-1 shrink-0"
                          style={{
                            width: `${squareSize}px`,
                            height: `${squareSize}px`,
                            minWidth: `${squareSize}px`,
                          }}
                        >
                          {day ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`hover:ring-foreground/50 hover:ring-offset-background h-full w-full cursor-pointer rounded-[3px] transition-colors hover:ring-1 hover:ring-offset-1 ${getIntensity(
                                    day.count
                                  )}`}
                                />
                              </TooltipTrigger>
                              {day.count !== -1 && (
                                <TooltipContent>
                                  <p>
                                    {day.count}{" "}
                                    {day.count === 1
                                      ? "engagement"
                                      : "engagements"}{" "}
                                    on {format(day.date, "MMM d, yyyy")}
                                  </p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          ) : (
                            <div className="h-full w-full" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </TooltipProvider>
            </div>

            {/* Legend */}
            <div className="text-muted-foreground mt-3 flex w-full items-center justify-end gap-2 text-xs">
              <span>Less</span>
              <div
                className="flex gap-[4px]"
                style={{ height: `${squareSize}px` }}
              >
                <div
                  className={`aspect-square h-full rounded-[3px] border ${colors[0]}`}
                />
                <div
                  className={`aspect-square h-full rounded-[3px] border ${colors[1]}`}
                />
                <div
                  className={`aspect-square h-full rounded-[3px] border ${colors[2]}`}
                />
                <div
                  className={`aspect-square h-full rounded-[3px] border ${colors[3]}`}
                />
                <div
                  className={`aspect-square h-full rounded-[3px] border ${colors[4]}`}
                />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
