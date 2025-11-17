/**
 * Navigation utilities for consistent routing throughout the app
 * Uses Next.js router for client-side navigation without full page reloads
 * Next.js automatically handles prefetching for Link components
 */

import { useRouter } from "next/navigation";

/**
 * Hook for programmatic navigation
 * Provides consistent navigation behavior across the app
 */
export function useAppNavigation() {
  const router = useRouter();

  const navigate = (path: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
  };

  const navigateBack = () => {
    router.back();
  };

  const navigateToRoom = (roomId: string) => {
    router.push(`/dashboard/rooms/${roomId}`);
  };

  const navigateToRooms = () => {
    router.push("/dashboard/rooms");
  };

  const navigateToDashboard = () => {
    router.push("/dashboard");
  };

  return {
    navigate,
    navigateBack,
    navigateToRoom,
    navigateToRooms,
    navigateToDashboard,
  };
}

