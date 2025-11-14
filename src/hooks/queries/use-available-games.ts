"use client";

import { useQuery } from "@tanstack/react-query";
import type { Game } from "@/types/queries";

async function fetchAvailableGames(): Promise<Game[]> {
  const response = await fetch("/api/games");
  if (!response.ok) {
    throw new Error("Failed to fetch available games");
  }
  return response.json();
}

export function useAvailableGames() {
  return useQuery({
    queryKey: ["games"],
    queryFn: fetchAvailableGames,
    staleTime: 5 * 60 * 1000, // 5 minutes (games don't change often)
    refetchOnMount: false, // Don't refetch if cached data exists
  });
}

