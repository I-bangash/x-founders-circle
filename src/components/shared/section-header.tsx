import { ReactNode } from "react";

import { cn } from "@/utils/utils";

interface SectionHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const ALIGNMENT_CLASSES = {
  left: "ml-0 text-left",
  center: "text-center",
  right: "mr-0 text-right",
};

const BADGE_ALIGNMENT_CLASSES = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export function SectionHeader({
  title,
  description,
  badge,
  align = "center",
  className,
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "relative z-10 mx-auto mb-16 max-w-4xl",
        ALIGNMENT_CLASSES[align],
        className
      )}
    >
      {badge && (
        <div className={cn("mb-8 flex w-full", BADGE_ALIGNMENT_CLASSES[align])}>
          {badge}
        </div>
      )}
      <h2
        className={cn(
          "text-foreground font-geist mb-6 text-4xl leading-[1.05] tracking-tighter sm:text-5xl lg:text-7xl",
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "font-geist mx-auto max-w-2xl text-lg leading-relaxed font-light text-gray-600 sm:text-xl dark:text-gray-400",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
