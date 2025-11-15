"use client";

import { createContext, useContext, ReactNode } from "react";

interface RoomEventsContextValue {
  broadcastRoomDeleted: (ownerName: string) => void;
}

const RoomEventsContext = createContext<RoomEventsContextValue | null>(null);

interface RoomEventsProviderProps {
  children: ReactNode;
  broadcastRoomDeleted: (ownerName: string) => void;
}

export function RoomEventsProvider({
  children,
  broadcastRoomDeleted,
}: RoomEventsProviderProps) {
  const value: RoomEventsContextValue = {
    broadcastRoomDeleted,
  };

  return (
    <RoomEventsContext.Provider value={value}>
      {children}
    </RoomEventsContext.Provider>
  );
}

export function useRoomEvents() {
  const context = useContext(RoomEventsContext);
  return context;
}
