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
        setOnlineUsers(extractUsersFromState(state));
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        setOnlineUsers((prev) => {
          const newUsers = newPresences
            .map(toRoomUser)
            .filter((user): user is RoomUser => {
              return user !== null && !prev.some((u) => u.userId === user.userId);
            });
          return [...prev, ...newUsers];
        });
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        setOnlineUsers((prev) => {
          const leftUserIds = new Set(
            leftPresences
              .map(toRoomUser)
              .filter((user): user is RoomUser => user !== null)
              .map((user) => user.userId)
          );
          return prev.filter((user) => !leftUserIds.has(user.userId));
        });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          await presenceChannel.track({
            userId,
            userName,
            displayUsername,
          });
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

