import { Spinner } from "@/components/ui/spinner";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

interface LoadingButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
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
  variant,
  size,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      className={cn("relative", className)}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner />
          {loadingText && <span>{loadingText}</span>}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
