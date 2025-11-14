"use client";

import { useQuery } from "@tanstack/react-query";
import type { ActiveRoom } from "@/types/queries";

async function fetchActiveRooms(): Promise<ActiveRoom[]> {
  const response = await fetch("/api/rooms/active");
  if (!response.ok) {
    throw new Error("Failed to fetch active rooms");
  }
  return response.json();
}

export function useActiveRooms() {
  return useQuery({
    queryKey: ["rooms", "active"],
    queryFn: fetchActiveRooms,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnMount: false, // Don't refetch if cached data exists
  });
}

