import { cn } from "@/utils/utils";

interface FeatureImageCardProps {
  backgroundImage: string;
  label: string;
  gradientColor: "emerald" | "amber" | "purple";
  className?: string;
}

const gradients = {
  emerald: "from-emerald-900/40",
  amber: "from-amber-900/40",
  purple: "from-purple-900/20",
};

export function FeatureImageCard({
  backgroundImage,
  label,
  gradientColor,
  className,
}: FeatureImageCardProps) {
  return (
    <div
      className={cn(
        "group/card relative flex min-h-[240px] flex-col items-center justify-center overflow-hidden rounded-[32px] border border-black/5 bg-[#121212] bg-cover bg-center p-8 opacity-90 transition-all duration-500 hover:opacity-100 dark:border-white/5 dark:opacity-80",
        className
      )}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-tr to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100",
          gradients[gradientColor]
        )}
      />
      <p className="font-geist mt-4 translate-y-2 transform rounded-full bg-black/50 px-3 py-1 text-sm font-medium tracking-widest text-white uppercase opacity-0 drop-shadow-md backdrop-blur-sm transition-all duration-500 group-hover/card:translate-y-0 group-hover/card:opacity-100">
        {label}
      </p>
    </div>
  );
}
