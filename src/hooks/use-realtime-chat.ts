import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export interface ChatMessage {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
}

/**
 * Creates a system message for chat events
 */
function createSystemMessage(content: string): ChatMessage {
  return {
    id: `system-${Date.now()}-${Math.random()}`,
    content,
    user: {
      id: "system",
      name: "System",
    },
    createdAt: new Date().toISOString(),
  };
}

/**
 * Adds a message to the messages array and calls the onMessage callback
 */
function addMessage(
  prev: ChatMessage[],
  message: ChatMessage,
  onMessage?: (messages: ChatMessage[]) => void
): ChatMessage[] {
  const updated = [...prev, message];
  onMessage?.(updated);
  return updated;
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
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(
    () => initialMessages
  );
  const [isConnected, setIsConnected] = useState(false);
  const [roomDeleted, setRoomDeleted] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const hasInitializedRef = useRef(false);

  // Sync initialMessages when they become available (e.g., after React Query loads)
  useEffect(() => {
    // Always sync initialMessages when they change, but preserve realtime messages
    if (Array.isArray(initialMessages)) {
      setMessages((prev) => {
        // If we haven't initialized yet, use initial messages
        if (!hasInitializedRef.current) {
          hasInitializedRef.current = true;
          return initialMessages.length > 0 ? initialMessages : prev;
        }
        
        // If initial messages are provided, merge them with existing messages
        if (initialMessages.length > 0) {
          // Create a map of existing message IDs for quick lookup
          const existingIds = new Set(prev.map((m) => m.id));
          
          // Filter out messages that already exist
          const newMessages = initialMessages.filter((m) => !existingIds.has(m.id));
          
          // If there are new messages, merge and sort
          if (newMessages.length > 0) {
            const merged = [...prev, ...newMessages].sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            return merged;
          }
        }
        
        // If initial messages is empty array and we have no messages, keep existing
        // This prevents clearing messages when React Query refetches with empty array
        return prev.length > 0 ? prev : initialMessages;
      });
    }
  }, [initialMessages]);

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
          return addMessage(prev, newMessage, onMessage);
        });
      })
      .on("broadcast", { event: "user-joined" }, ({ payload }) => {
        // Don't show join message for yourself
        if (payload.userId === userId) return;

        const systemMessage = createSystemMessage(
          `${payload.displayUsername || payload.userName} joined the room`
        );
        setMessages((prev) => addMessage(prev, systemMessage, onMessage));
      })
      .on("broadcast", { event: "user-left" }, ({ payload }) => {
        // Don't show leave message for yourself
        if (payload.userId === userId) return;

        const systemMessage = createSystemMessage(
          `${payload.displayUsername || payload.userName} left the room`
        );
        setMessages((prev) => addMessage(prev, systemMessage, onMessage));
      })
      .on("broadcast", { event: "room-deleted" }, ({ payload }) => {
        // Room was deleted by owner - kick everyone out
        const systemMessage = createSystemMessage(
          `This room has been deleted by ${payload.ownerName}`
        );
        setMessages((prev) => addMessage(prev, systemMessage));
        setRoomDeleted(true);

        // Redirect after a brief delay to show the message
        setTimeout(() => {
          if (typeof window !== "undefined") {
            router.push("/dashboard/rooms");
          }
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
  }, [roomId, userId, userName, displayUsername, onMessage, router]);

  const sendMessage = useCallback(
    async (
      content: string,
      saveToDb?: (
        roomId: string,
        content: string
      ) => Promise<{ success: boolean; error?: string }>
    ) => {
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

      // Optimistic update: Add message to UI immediately
      setMessages((prev) => addMessage(prev, message, onMessage));

      // Broadcast to other users immediately (non-blocking)
      channel.send({
        type: "broadcast",
        event: "message",
        payload: message,
      });

      // Save to database in the background (don't await)
      if (saveToDb) {
        saveToDb(roomId, content.trim()).catch((error) => {
          console.error("Failed to save message:", error);
        });
      }
    },
    [isConnected, userId, userName, displayUsername, roomId, onMessage]
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
