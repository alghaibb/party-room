"use client";

import type { UserRoom } from "@/types/queries";
import { createQueryHook, createFetchFn } from "./query-factory";

const fetchUserRooms = createFetchFn<UserRoom[]>(
  "/api/rooms/user",
  "Failed to fetch user rooms"
);

export const useUserRooms = createQueryHook({
  queryKey: ["rooms", "user"],
  fetchFn: async () => {
    try {
      const data = await fetchUserRooms();
      // Ensure we always return an array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching user rooms:", error);
      return [];
    }
  },
  staleTime: 30 * 1000, // 30 seconds
});

