import { cn } from "@/libs/utils";

interface CategoryHeaderProps {
  id?: string;
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  titleClassName?: string;
  gradientClassName?: string;
  iconClassName?: string;
  className?: string;
}

export function CategoryHeader({
  id,
  title,
  subtitle,
  icon,
  titleClassName,
  gradientClassName,
  iconClassName,
  className,
}: CategoryHeaderProps) {
  return (
    <div id={id} className={cn("scroll-mt-32", className)}>
      <div className="relative mb-8 flex items-end justify-between overflow-hidden border-b border-black/10 pb-4 dark:border-white/10">
        {gradientClassName && (
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent",
              gradientClassName
            )}
          />
        )}
        <div className="relative z-10">
          <h3
            className={cn(
              "font-geist mb-1 text-2xl tracking-tight",
              titleClassName
            )}
          >
            {title}
          </h3>
          <p className="font-geist text-xs tracking-widest text-gray-500 uppercase">
            {subtitle}
          </p>
        </div>
        {icon && (
          <div className={cn("relative z-10", iconClassName)}>{icon}</div>
        )}
      </div>
    </div>
  );
}
