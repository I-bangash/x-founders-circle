"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DateRangePicker({
  date,
  onDateChange,
  className,
}: {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className={cn(
            "data-[empty=true]:text-muted-foreground h-8 w-auto justify-start rounded-full px-4 text-xs font-normal",
            date ? "min-w-[130px] text-left" : "",
            className
          )}
        >
          <CalendarIcon className={cn("h-4 w-4", date ? "mr-2" : "mx-auto")} />
          {date ? format(date, "PPP") : ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar mode="single" selected={date} onSelect={onDateChange} />
      </PopoverContent>
    </Popover>
  );
}
