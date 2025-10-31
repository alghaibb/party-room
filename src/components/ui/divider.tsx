import { cn } from "@/lib/utils";

interface DividerProps {
  text?: string;
  className?: string;
}

function Divider({ text = "or", className }: DividerProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground font-medium">
          {text}
        </span>
      </div>
    </div>
  );
}

export { Divider };
