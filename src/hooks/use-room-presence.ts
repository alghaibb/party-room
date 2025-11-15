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

        setOnlineUsers(users);
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        setOnlineUsers((prev) => {
          const updatedUsers = [...prev];
          newPresences.forEach((presence) => {
            const presenceData = presence as unknown as RoomUser;
            if (
              presenceData.userId &&
              !updatedUsers.some((u) => u.userId === presenceData.userId)
            ) {
              updatedUsers.push({
                userId: presenceData.userId,
                displayUsername: presenceData.displayUsername,
                userName: presenceData.userName,
              });
            }
          });
          return updatedUsers;
        });
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        setOnlineUsers((prev) => {
          const updatedUsers = prev.filter((user) => {
            return !leftPresences.some((p) => {
              const presenceData = p as unknown as RoomUser;
              return presenceData.userId === user.userId;
            });
          });
          return updatedUsers;
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

