"use client";

import { useQuery } from "@tanstack/react-query";
import type { UserRoom } from "@/types/queries";

async function fetchUserRooms(): Promise<UserRoom[]> {
  const response = await fetch("/api/rooms/user");
  if (!response.ok) {
    throw new Error("Failed to fetch user rooms");
  }
  return response.json();
}

export function useUserRooms() {
  return useQuery({
    queryKey: ["rooms", "user"],
    queryFn: fetchUserRooms,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnMount: false, // Don't refetch if cached data exists
  });
}

