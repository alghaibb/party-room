"use client";

import { useActiveRooms } from "@/hooks/queries/use-active-rooms";
import { useQuery } from "@tanstack/react-query";
import { RoomCard } from "./RoomCard";

async function fetchSession() {
  const response = await fetch("/api/auth/session");
  if (!response.ok) return null;
  return response.json();
}

export function RoomGrid() {
  const { data: rooms } = useActiveRooms();
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
  });

  const isVerified = session?.user?.emailVerified || false;
  const currentUserId = session?.user?.id;

  // Show loader only when there's no cached data (first load)
  if (rooms === undefined) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  // Show empty state if data exists but array is empty
  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🎮</span>
        </div>
        <h3 className="font-semibold text-lg mb-2">No Active Rooms</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Be the first to create a party room and get the fun started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          isVerified={isVerified}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
