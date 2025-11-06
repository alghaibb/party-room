"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface ChatMessage {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface UseRealtimeChatProps {
  roomId: string;
  userId: string;
  userName: string;
  displayUsername: string;
  initialMessages?: ChatMessage[];
  onMessage?: (messages: ChatMessage[]) => void;
}

export function useRealtimeChat({
  roomId,
  userId,
  userName,
  displayUsername,
  initialMessages = [],
  onMessage,
}: UseRealtimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => initialMessages);
  const [isConnected, setIsConnected] = useState(false);
  const [roomDeleted, setRoomDeleted] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Set up Supabase Realtime channel
  useEffect(() => {
    let hasJoined = false;

    const roomChannel = supabase.channel(`room:${roomId}`, {
      config: {
        broadcast: { self: true }, // Receive our own broadcasts
      },
    });

    channelRef.current = roomChannel;

    roomChannel
      .on("broadcast", { event: "message" }, ({ payload }) => {
        const newMessage = payload as ChatMessage;
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((msg) => msg.id === newMessage.id)) {
            return prev;
          }
          const updated = [...prev, newMessage];
          onMessage?.(updated);
          return updated;
        });
      })
      .on("broadcast", { event: "user-joined" }, ({ payload }) => {
        // Don't show join message for yourself
        if (payload.userId === userId) return;

        const systemMessage: ChatMessage = {
          id: `system-${Date.now()}-${Math.random()}`,
          content: `${payload.displayUsername || payload.userName} joined the room`,
          user: {
            id: "system",
            name: "System",
          },
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => {
          const updated = [...prev, systemMessage];
          onMessage?.(updated);
          return updated;
        });
      })
      .on("broadcast", { event: "user-left" }, ({ payload }) => {
        // Don't show leave message for yourself
        if (payload.userId === userId) return;

        const systemMessage: ChatMessage = {
          id: `system-${Date.now()}-${Math.random()}`,
          content: `${payload.displayUsername || payload.userName} left the room`,
          user: {
            id: "system",
            name: "System",
          },
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => {
          const updated = [...prev, systemMessage];
          onMessage?.(updated);
          return updated;
        });
      })
      .on("broadcast", { event: "room-deleted" }, ({ payload }) => {
        // Room was deleted by owner - kick everyone out
        const systemMessage: ChatMessage = {
          id: `system-${Date.now()}-${Math.random()}`,
          content: `This room has been deleted by ${payload.ownerName}`,
          user: {
            id: "system",
            name: "System",
          },
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, systemMessage]);
        setRoomDeleted(true);

        // Redirect after a brief delay to show the message
        setTimeout(() => {
          window.location.href = "/dashboard/rooms";
        }, 2000);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          hasJoined = true;
          // Broadcast user joined event
          roomChannel.send({
            type: "broadcast",
            event: "user-joined",
            payload: { userId, userName, displayUsername },
          });
        } else if (status === "CLOSED") {
          setIsConnected(false);
        }
      });

    // Only send leave event on page unload, not component unmount
    const handleBeforeUnload = () => {
      if (hasJoined && roomChannel) {
        roomChannel.send({
          type: "broadcast",
          event: "user-left",
          payload: { userId, userName, displayUsername },
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (roomChannel) {
        roomChannel.unsubscribe();
      }
    };
  }, [roomId, userId, userName, displayUsername, onMessage]);

  const sendMessage = useCallback(
    async (content: string, saveToDb?: (roomId: string, content: string) => Promise<{ success: boolean; error?: string }>) => {
      const channel = channelRef.current;
      if (!channel || !isConnected || !content.trim()) return;

      const message: ChatMessage = {
        id: `${userId}-${Date.now()}`,
        content: content.trim(),
        user: {
          id: userId,
          name: displayUsername || userName,
        },
        createdAt: new Date().toISOString(),
      };

      // Save to database if handler provided
      if (saveToDb) {
        try {
          await saveToDb(roomId, content.trim());
        } catch (error) {
          console.error("Failed to save message:", error);
        }
      }

      channel.send({
        type: "broadcast",
        event: "message",
        payload: message,
      });
    },
    [isConnected, userId, userName, displayUsername, roomId]
  );

  const broadcastRoomDeleted = useCallback(
    (ownerName: string) => {
      const channel = channelRef.current;
      if (!channel) return;

      channel.send({
        type: "broadcast",
        event: "room-deleted",
        payload: { roomId, ownerName },
      });
    },
    [roomId]
  );

  return {
    messages,
    isConnected,
    sendMessage,
    broadcastRoomDeleted,
    roomDeleted,
  };
}

