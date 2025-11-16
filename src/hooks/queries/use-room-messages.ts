"use client";

import type { RoomMessage } from "@/types/queries";
import { createParamQueryHook, createParamFetchFn } from "./query-factory";

const fetchRoomMessages = createParamFetchFn<RoomMessage[]>(
  (roomId) => `/api/rooms/${roomId}/messages`,
  "Failed to fetch room messages"
);


export const useRoomMessages = createParamQueryHook({
  baseQueryKey: ["rooms", "messages"],
  fetchFn: async (roomId: string) => {
    try {
      const data = await fetchRoomMessages(roomId);
      // Ensure we always return an array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching room messages:", error);
      return [];
    }
  },
  staleTime: 10 * 1000, // 10 seconds
  getEnabled: (roomId) => !!roomId,
});

