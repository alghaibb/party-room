"use client";

import { useQueryClient } from "@tanstack/react-query";

export function useInvalidateRooms() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    invalidateActive: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms", "active"] });
    },
    invalidateUserRooms: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms", "user"] });
    },
    invalidateStats: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms", "stats"] });
    },
    invalidateRoom: (roomId: string) => {
      queryClient.invalidateQueries({ queryKey: ["rooms", roomId] });
    },
    invalidateRoomMessages: (roomId: string) => {
      queryClient.invalidateQueries({ queryKey: ["rooms", roomId, "messages"] });
    },
  };
}

