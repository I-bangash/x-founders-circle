import * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/utils/utils";

const sectionBadgeVariants = cva(
  "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest font-geist border backdrop-blur-md transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-800 dark:text-gray-200",
        emerald:
          "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
        orange:
          "bg-orange-500/10 border-orange-500/20 text-orange-500 dark:text-orange-400",
        outline:
          "bg-transparent border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-black/20 dark:hover:border-white/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface SectionBadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionBadgeVariants> {}

export function SectionBadge({
  className,
  variant,
  ...props
}: SectionBadgeProps) {
  return (
    <div
      className={cn(sectionBadgeVariants({ variant }), className)}
      {...props}
    />
  );
}
