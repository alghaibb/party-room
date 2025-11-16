"use client";

import type { RoomDetails } from "@/types/queries";
import { createParamQueryHook, createParamFetchFn } from "./query-factory";

const fetchRoomDetails = createParamFetchFn<RoomDetails>(
  (roomId) => `/api/rooms/${roomId}`,
  "Failed to fetch room details"
);

export const useRoomDetails = createParamQueryHook({
  baseQueryKey: ["rooms"],
  fetchFn: async (roomId: string) => {
    try {
      const data = await fetchRoomDetails(roomId);
      // Ensure members is always an array
      if (data && typeof data === 'object' && 'members' in data) {
        return {
          ...data,
          members: Array.isArray(data.members) ? data.members : [],
        } as RoomDetails;
      }
      return data;
    } catch (error) {
      console.error("Error fetching room details:", error);
      throw error;
    }
  },
  staleTime: 30 * 1000, // 30 seconds
  getEnabled: (roomId) => !!roomId,
});

