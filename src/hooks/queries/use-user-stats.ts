"use client";

import { useQuery } from "@tanstack/react-query";
import type { UserStats } from "@/types/queries";

async function fetchUserStats(): Promise<UserStats> {
  const response = await fetch("/api/user/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch user stats");
  }
  return response.json();
}

export function useUserStats() {
  return useQuery({
    queryKey: ["user-stats"],
    queryFn: fetchUserStats,
    staleTime: 60 * 1000, // 1 minute
    refetchOnMount: false, // Don't refetch if cached data exists
  });
}

