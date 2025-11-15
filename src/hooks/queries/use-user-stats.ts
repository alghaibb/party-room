"use client";

import type { UserStats } from "@/types/queries";
import { createQueryHook, createFetchFn } from "./query-factory";

const fetchUserStats = createFetchFn<UserStats>(
  "/api/user/stats",
  "Failed to fetch user stats"
);

export const useUserStats = createQueryHook({
  queryKey: ["user-stats"],
  fetchFn: fetchUserStats,
  staleTime: 60 * 1000, // 1 minute
});

