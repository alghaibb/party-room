"use client";

import type { ActiveRoom } from "@/types";
import { createQueryHook, createFetchFn } from "./query-factory";

const fetchActiveRooms = createFetchFn<ActiveRoom[]>(
  "/api/rooms/active",
  "Failed to fetch active rooms"
);

export const useActiveRooms = createQueryHook({
  queryKey: ["rooms", "active"],
  fetchFn: async () => {
    try {
      const data = await fetchActiveRooms();
      // Ensure we always return an array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching active rooms:", error);
      return [];
    }
  },
  staleTime: 30 * 1000, // 30 seconds
});

