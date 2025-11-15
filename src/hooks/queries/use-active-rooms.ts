"use client";

import type { ActiveRoom } from "@/types/queries";
import { createQueryHook, createFetchFn } from "./query-factory";

const fetchActiveRooms = createFetchFn<ActiveRoom[]>(
  "/api/rooms/active",
  "Failed to fetch active rooms"
);

export const useActiveRooms = createQueryHook({
  queryKey: ["rooms", "active"],
  fetchFn: fetchActiveRooms,
  staleTime: 30 * 1000, // 30 seconds
});

