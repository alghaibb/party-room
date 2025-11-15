"use client";

import type { RoomMessage } from "@/types/queries";
import { createParamQueryHook, createParamFetchFn } from "./query-factory";

const fetchRoomMessages = createParamFetchFn<RoomMessage[]>(
  (roomId) => `/api/rooms/${roomId}/messages`,
  "Failed to fetch room messages"
);

export const useRoomMessages = createParamQueryHook({
  baseQueryKey: ["rooms"],
  fetchFn: (roomId: string) => fetchRoomMessages(roomId),
  staleTime: 10 * 1000, // 10 seconds
  getEnabled: (roomId) => !!roomId,
});

