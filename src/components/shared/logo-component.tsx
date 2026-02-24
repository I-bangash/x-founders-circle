import Image from "next/image";
import Link from "next/link";

import { cn } from "@/utils/utils";

interface LogoComponentProps {
  isLoading?: boolean;
  className?: string;
  useImage?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeVariants = {
  sm: {
    container: "size-6",
    icon: "size-4",
    image: { width: 20, height: 20 },
    text: "text-xs",
  },
  md: {
    container: "size-8",
    icon: "size-5",
    image: { width: 30, height: 30 },
    text: "text-sm",
  },
  lg: {
    container: "size-10",
    icon: "size-6",
    image: { width: 35, height: 35 },
    text: "text-base",
  },
};

const LogoComponent = ({
  isLoading,
  className,
  useImage,
  size = "md",
}: LogoComponentProps) => {
  const sizeClass = sizeVariants[size];

  return (
    <Link
      href="/"
      className={cn(
        "relative z-20 flex items-center gap-2 px-2 py-1",
        className
      )}
    >
      <div
        className={cn(
          "flex aspect-square items-center justify-center rounded-lg bg-[linear-gradient(to_bottom_right,#18181B,#27272A)] shadow-sm dark:bg-[linear-gradient(to_bottom_right,#f8fafc,#f1f5f9)]",
          sizeClass.container
        )}
      >
        {useImage ? (
          <Image
            src="/images/viral-launch-logo.png"
            alt="ViralLaunch Logo"
            width={sizeClass.image.width}
            height={sizeClass.image.height}
          />
        ) : (
          <Image
            src="/images/viral-launch-logo.png"
            alt="ViralLaunch Logo"
            width={sizeClass.image.width}
            height={sizeClass.image.height}
          />
        )}
      </div>
      <div
        className={cn("grid flex-1 text-left leading-tight", sizeClass.text)}
      >
        <span
          className={cn(
            "text-foreground truncate font-semibold tracking-tight",
            isLoading && "animate-pulse"
          )}
        >
          ViralLaunch
        </span>
      </div>
    </Link>
  );
};

export default LogoComponent;
