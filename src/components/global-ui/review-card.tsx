import { cn } from "@/libs/utils";

interface ReviewCardProps {
  quote: React.ReactNode;
  author: string;
  role: string;
  initial: string;
  icon: React.ReactNode;
  accentColor: "emerald" | "amber" | "blue";
  className?: string;
}

export function ReviewCard({
  quote,
  author,
  role,
  initial,
  icon,
  accentColor,
  className,
}: ReviewCardProps) {
  const accentTextColors = {
    emerald: "text-emerald-600 dark:text-emerald-500",
    amber: "text-amber-500",
    blue: "text-blue-500 dark:text-blue-400",
  };

  return (
    <div
      className={cn(
        "group/card relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-[32px] border border-black/5 bg-gray-100 p-8 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:border-black/10 dark:border-white/5 dark:bg-[#151515] dark:hover:border-white/10",
        className
      )}
    >
      <div
        className={cn(
          "absolute top-0 right-0 p-6 opacity-20 transition-all duration-500 group-hover/card:opacity-50",
          accentTextColors[accentColor]
        )}
      >
        {icon}
      </div>
      <p className="font-geist text-xl leading-relaxed font-light tracking-tight text-gray-600 dark:text-gray-300">
        {quote}
      </p>
      <div className="mt-6 flex items-center gap-3 border-t border-black/5 pt-6 dark:border-white/5">
        <div className="text-foreground font-geist flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-xs font-bold dark:bg-white/10">
          {initial}
        </div>
        <div>
          <div className="text-foreground font-geist text-sm font-semibold">
            {author}
          </div>
          <div className="font-geist text-xs text-gray-500">{role}</div>
        </div>
      </div>
    </div>
  );
}
