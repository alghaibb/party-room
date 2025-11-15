import { useRouter } from "next/navigation";
import { startTransition } from "react";

/**
 * Custom hook for prefetching routes on hover/focus
 * Uses startTransition for non-blocking prefetching
 */
export function usePrefetch() {
  const router = useRouter();

  const prefetch = (href: string) => {
    startTransition(() => {
      router.prefetch(href);
    });
  };

  return { prefetch };
}

