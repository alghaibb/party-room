import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

interface RoomUser {
  userId: string;
  displayUsername: string;
  userName: string;
}

interface UseRoomPresenceProps {
  roomId: string;
  userId: string;
  userName: string;
  displayUsername: string;
}

/**
 * Extracts users from presence state
 */
function extractUsersFromState(state: Record<string, RoomUser[]>): RoomUser[] {
  const users: RoomUser[] = [];
  Object.values(state).forEach((presences) => {
    presences.forEach((presence) => {
      users.push({
        userId: presence.userId,
        displayUsername: presence.displayUsername,
        userName: presence.userName,
      });
    });
  });
  return users;
}

/**
 * Converts presence data to RoomUser
 */
function toRoomUser(presence: unknown): RoomUser | null {
  const data = presence as RoomUser;
  return data.userId ? data : null;
}

export function useRoomPresence({
  roomId,
  userId,
  userName,
  displayUsername,
}: UseRoomPresenceProps) {
  const [onlineUsers, setOnlineUsers] = useState<RoomUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!roomId || !userId) {
      console.warn("[useRoomPresence] Missing roomId or userId", { roomId, userId });
      return;
    }

    console.log("[useRoomPresence] Setting up presence", { roomId, userId, userName, displayUsername });
    const presenceChannel = supabase.channel(`presence:${roomId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState<RoomUser>();
        const users = extractUsersFromState(state);
        console.log("[useRoomPresence] Presence sync", { usersCount: users.length, users: users.map(u => ({ userId: u.userId, userName: u.userName })) });
        setOnlineUsers(users);
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        console.log("[useRoomPresence] User joined", { newPresences });
        setOnlineUsers((prev) => {
          const newUsers = newPresences
            .map(toRoomUser)
            .filter((user): user is RoomUser => {
              return user !== null && !prev.some((u) => u.userId === user.userId);
            });
          console.log("[useRoomPresence] Added new users", { newUsers: newUsers.map(u => ({ userId: u.userId, userName: u.userName })), totalCount: prev.length + newUsers.length });
          return [...prev, ...newUsers];
        });
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        console.log("[useRoomPresence] User left", { leftPresences });
        setOnlineUsers((prev) => {
          const leftUserIds = new Set(
            leftPresences
              .map(toRoomUser)
              .filter((user): user is RoomUser => user !== null)
              .map((user) => user.userId)
          );
          const filtered = prev.filter((user) => !leftUserIds.has(user.userId));
          console.log("[useRoomPresence] Removed users", { leftUserIds: Array.from(leftUserIds), remainingCount: filtered.length });
          return filtered;
        });
      })
      .subscribe(async (status) => {
        console.log("[useRoomPresence] Subscription status", { status, roomId, userId });
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          console.log("[useRoomPresence] Subscribed, tracking presence", { userId, userName, displayUsername });
          await presenceChannel.track({
            userId,
            userName,
            displayUsername,
          });
          // Immediately sync presence state after tracking
          const state = presenceChannel.presenceState<RoomUser>();
          const users = extractUsersFromState(state);
          console.log("[useRoomPresence] Initial presence state after track", { usersCount: users.length, users: users.map(u => ({ userId: u.userId, userName: u.userName })) });
          setOnlineUsers(users);
        } else if (status === "CLOSED") {
          // CLOSED is normal during cleanup, not an error
          setIsConnected(false);
        } else if (status === "CHANNEL_ERROR") {
          console.error("[useRoomPresence] Channel error", { status });
          setIsConnected(false);
        }
      });

    return () => {
      presenceChannel.unsubscribe();
    };
  }, [roomId, userId, userName, displayUsername]);

  return {
    onlineUsers,
    isConnected,
  };
}

