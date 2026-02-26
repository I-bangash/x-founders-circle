import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const GlassCard = ({ children, className }: Props) => {
  return (
    <Card
      className={cn(
        className,
        "rounded-2xl bg-clip-padding backdrop-filter",
        "dark:bg-themeGray dark:border-themeGray border-white/20 bg-white/40",
        "backdrop--blur__safari backdrop-blur-4xl",
        "dark:bg-opacity-40"
      )}
    >
      {children}
    </Card>
  );
};

export default GlassCard;
