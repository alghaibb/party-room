"use client";

import type { Game } from "@/types";
import { createQueryHook, createFetchFn } from "./query-factory";

const fetchAvailableGames = createFetchFn<Game[]>(
  "/api/games",
  "Failed to fetch available games"
);

export const useAvailableGames = createQueryHook({
  queryKey: ["games"],
  fetchFn: async () => {
    try {
      const data = await fetchAvailableGames();
      // Ensure we always return an array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching available games:", error);
      return [];
    }
  },
  staleTime: 5 * 60 * 1000, // 5 minutes (games don't change often)
});

