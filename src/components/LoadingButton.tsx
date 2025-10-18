"use client";

import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loading: boolean;
  loadingText?: string;
  spinnerClassName?: string;
}

export function LoadingButton({
  children,
  loading,
  loadingText,
  spinnerClassName,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Button
      {...props}
      disabled={isDisabled}
      className={cn("relative", className)}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Spinner className={cn("size-4", spinnerClassName)} />
          <span>{loadingText || "Loading..."}</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
