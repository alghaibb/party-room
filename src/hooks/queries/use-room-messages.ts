"use client";

import { useQuery } from "@tanstack/react-query";
import type { RoomMessage } from "@/types/queries";

async function fetchRoomMessages(roomId: string): Promise<RoomMessage[]> {
  const response = await fetch(`/api/rooms/${roomId}/messages`);
  if (!response.ok) {
    throw new Error("Failed to fetch room messages");
  }
  return response.json();
}

export function useRoomMessages(roomId: string) {
  return useQuery({
    queryKey: ["rooms", roomId, "messages"],
    queryFn: () => fetchRoomMessages(roomId),
    staleTime: 10 * 1000, // 10 seconds
    refetchOnMount: false, // Don't refetch if cached data exists
    enabled: !!roomId,
  });
}

