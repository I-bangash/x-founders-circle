import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  container?: string;
};

const BackdropGradient = ({ children, className, container }: Props) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className={cn("relative flex w-full flex-col", container)}>
      <div
      // className={cn(
      //   "absolute mx-10 rounded-[50%]",
      //   "bg-gradient-to-r from-white via-white to-white dark:from-blue-600 dark:via-purple-600 dark:to-pink-600",
      //   resolvedTheme === "light" ? "radial--gradient" : "radial--blur",
      //   className
      // )}
      />
      {children}
    </div>
  );
};

export default BackdropGradient;
