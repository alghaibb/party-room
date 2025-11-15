"use client";

import type { RoomDetails } from "@/types/queries";
import { createParamQueryHook, createParamFetchFn } from "./query-factory";

const fetchRoomDetails = createParamFetchFn<RoomDetails>(
  (roomId) => `/api/rooms/${roomId}`,
  "Failed to fetch room details"
);

export const useRoomDetails = createParamQueryHook({
  baseQueryKey: ["rooms"],
  fetchFn: fetchRoomDetails,
  staleTime: 30 * 1000, // 30 seconds
  getEnabled: (roomId) => !!roomId,
});

