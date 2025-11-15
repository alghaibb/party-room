"use client";

import type { UserRoom } from "@/types/queries";
import { createQueryHook, createFetchFn } from "./query-factory";

const fetchUserRooms = createFetchFn<UserRoom[]>(
  "/api/rooms/user",
  "Failed to fetch user rooms"
);

export const useUserRooms = createQueryHook({
  queryKey: ["rooms", "user"],
  fetchFn: fetchUserRooms,
  staleTime: 30 * 1000, // 30 seconds
});

