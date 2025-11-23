"use client";

import type { RoomStats } from "@/types";
import { createQueryHook, createFetchFn } from "./query-factory";

const fetchRoomStats = createFetchFn<RoomStats>(
  "/api/rooms/stats",
  "Failed to fetch room stats"
);

export const useRoomStats = createQueryHook({
  queryKey: ["rooms", "stats"],
  fetchFn: fetchRoomStats,
  staleTime: 60 * 1000, // 1 minute
});

