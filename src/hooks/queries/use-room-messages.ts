"use client";

import type { RoomMessage } from "@/types/queries";
import { createParamQueryHook, createParamFetchFn } from "./query-factory";

const fetchRoomMessages = createParamFetchFn<RoomMessage[]>(
  (roomId) => `/api/rooms/${roomId}/messages`,
  "Failed to fetch room messages"
);


export const useRoomMessages = createParamQueryHook({
  baseQueryKey: ["rooms", "messages"], // Changed from ["rooms"] to avoid conflict
  fetchFn: async (roomId: string) => {
    console.log(`[useRoomMessages] Fetching messages for room: ${roomId}`);
    const endpoint = `/api/rooms/${roomId}/messages`;
    console.log(`[useRoomMessages] Direct fetch to: ${endpoint}`);
    try {
      const data = await fetchRoomMessages(roomId);
      console.log(`[useRoomMessages] Received data:`, Array.isArray(data) ? `${data.length} messages` : typeof data, data);
      // Ensure we always return an array
      const result = Array.isArray(data) ? data : [];
      console.log(`[useRoomMessages] Returning ${result.length} messages`);
      return result;
    } catch (error) {
      console.error("[useRoomMessages] Error fetching room messages:", error);
      return [];
    }
  },
  staleTime: 10 * 1000, // 10 seconds
  getEnabled: (roomId) => {
    const enabled = !!roomId;
    console.log(`[useRoomMessages] Query enabled for roomId ${roomId}:`, enabled);
    return enabled;
  },
});

