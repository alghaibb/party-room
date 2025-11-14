"use client";

import { useQuery } from "@tanstack/react-query";
import type { RoomDetails } from "@/types/queries";

async function fetchRoomDetails(roomId: string): Promise<RoomDetails> {
  const response = await fetch(`/api/rooms/${roomId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch room details");
  }
  return response.json();
}

export function useRoomDetails(roomId: string) {
  return useQuery({
    queryKey: ["rooms", roomId],
    queryFn: () => fetchRoomDetails(roomId),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnMount: false, // Don't refetch if cached data exists
    enabled: !!roomId,
  });
}

