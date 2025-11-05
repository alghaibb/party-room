import { useState } from "react";
import { Room } from "@/types/room";

// Custom hook for optimistic room updates
export function useOptimisticRoom(initialRooms: Room[]) {
  const [optimisticRooms, setOptimisticRooms] = useState(initialRooms);

  const addOptimisticRoom = (room: Room) => {
    setOptimisticRooms(prev => [room, ...prev]);
  };

  const removeOptimisticRoom = (roomId: string) => {
    setOptimisticRooms(prev => prev.filter(room => room.id !== roomId));
  };

  const updateOptimisticRoom = (roomId: string, updates: Partial<Room>) => {
    setOptimisticRooms(prev => prev.map(room =>
      room.id === roomId ? { ...room, ...updates } : room
    ));
  };

  const incrementPlayerCount = (roomId: string) => {
    const room = optimisticRooms.find(r => r.id === roomId);
    if (room) {
      updateOptimisticRoom(roomId, {
        currentPlayers: room.currentPlayers + 1
      });
    }
  };

  const decrementPlayerCount = (roomId: string) => {
    const room = optimisticRooms.find(r => r.id === roomId);
    if (room) {
      updateOptimisticRoom(roomId, {
        currentPlayers: Math.max(0, room.currentPlayers - 1)
      });
    }
  };

  return {
    rooms: optimisticRooms,
    addOptimisticRoom,
    removeOptimisticRoom,
    updateOptimisticRoom,
    incrementPlayerCount,
    decrementPlayerCount,
    resetRooms: () => setOptimisticRooms(initialRooms),
  };
}
