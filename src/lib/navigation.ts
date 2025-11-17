/**
 * Navigation utilities for consistent routing throughout the app
 * Uses Next.js router for client-side navigation without full page reloads
 * Next.js automatically handles prefetching for Link components
 */

import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Hook for programmatic navigation
 * Provides consistent navigation behavior across the app
 */
export function useAppNavigation() {
  const router = useRouter();

  const navigate = useCallback(
    (path: string, options?: { replace?: boolean }) => {
      if (options?.replace) {
        router.replace(path);
      } else {
        router.push(path);
      }
    },
    [router]
  );

  const navigateBack = useCallback(() => {
    router.back();
  }, [router]);

  const navigateToRoom = useCallback(
    (roomId: string) => {
      router.push(`/dashboard/rooms/${roomId}`);
    },
    [router]
  );

  const navigateToRooms = useCallback(() => {
    router.push("/dashboard/rooms");
  }, [router]);

  const navigateToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  return {
    navigate,
    navigateBack,
    navigateToRoom,
    navigateToRooms,
    navigateToDashboard,
  };
}

