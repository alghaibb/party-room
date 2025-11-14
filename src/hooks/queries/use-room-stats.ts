"use client";

import { useQuery } from "@tanstack/react-query";
import type { RoomStats } from "@/types/queries";

async function fetchRoomStats(): Promise<RoomStats> {
  const response = await fetch("/api/rooms/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch room stats");
  }
  return response.json();
}

export function useRoomStats() {
  return useQuery({
    queryKey: ["rooms", "stats"],
    queryFn: fetchRoomStats,
    staleTime: 60 * 1000, // 1 minute
    refetchOnMount: false, // Don't refetch if cached data exists
  });
}

