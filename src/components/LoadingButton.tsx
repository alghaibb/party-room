import { Spinner } from "@/components/ui/spinner";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends React.ComponentProps<"button"> {
  children: React.ReactNode;
  isLoading: boolean;
  loadingText?: string;
}

export function LoadingButton({
  children,
  isLoading,
  className,
  loadingText,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      className={cn("relative", className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner />
          {loadingText && <span className="ml-2">{loadingText}</span>}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
