"use client";

import type { Game } from "@/types/queries";
import { createQueryHook, createFetchFn } from "./query-factory";

const fetchAvailableGames = createFetchFn<Game[]>(
  "/api/games",
  "Failed to fetch available games"
);

export const useAvailableGames = createQueryHook({
  queryKey: ["games"],
  fetchFn: fetchAvailableGames,
  staleTime: 5 * 60 * 1000, // 5 minutes (games don't change often)
});

