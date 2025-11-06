"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconMessage,
  IconSend,
  IconWifi,
  IconWifiOff,
} from "@tabler/icons-react";
import { useRealtimeChat } from "@/hooks/use-realtime-chat";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { ChatMessageItem } from "./ChatMessage";
import type { ChatMessage } from "@/hooks/use-realtime-chat";
import { saveMessage } from "../actions";

interface ChatAreaProps {
  roomId: string;
  roomName: string;
  currentUserId: string;
  currentUserName: string;
  currentUserDisplayUsername: string;
  initialMessages?: ChatMessage[];
  onMessageSent?: (messages: ChatMessage[]) => void;
}

export function ChatArea({
  roomId,
  currentUserId,
  currentUserName,
  currentUserDisplayUsername,
  initialMessages = [],
  onMessageSent,
}: ChatAreaProps) {
  const [messageInput, setMessageInput] = useState("");

  const { messages, isConnected, sendMessage, broadcastRoomDeleted } =
    useRealtimeChat({
      roomId,
      userId: currentUserId,
      userName: currentUserName,
      displayUsername: currentUserDisplayUsername,
      initialMessages,
      onMessage: onMessageSent,
    });

  const { containerRef, scrollToBottom } = useChatScroll();

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Expose broadcastRoomDeleted to parent via window for RoomManagementDropdown
  useEffect(() => {
    (
      window as typeof window & {
        broadcastRoomDeleted?: typeof broadcastRoomDeleted;
      }
    ).broadcastRoomDeleted = broadcastRoomDeleted;
    return () => {
      delete (
        window as typeof window & {
          broadcastRoomDeleted?: typeof broadcastRoomDeleted;
        }
      ).broadcastRoomDeleted;
    };
  }, [broadcastRoomDeleted]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !isConnected) return;

    await sendMessage(messageInput, saveMessage);
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <IconMessage className="w-4 h-4" />
            Room Chat
          </div>
          <Badge
            variant={isConnected ? "default" : "secondary"}
            className="text-xs"
            suppressHydrationWarning
          >
            {isConnected ? (
              <>
                <IconWifi className="w-3 h-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <IconWifiOff className="w-3 h-3 mr-1" />
                Connecting...
              </>
            )}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
        {/* Messages Area */}
        <div
          ref={containerRef}
          className="flex-1 space-y-1 overflow-y-auto min-h-0 pr-2"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <IconMessage className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((message, index) => {
              const previousMessage = index > 0 ? messages[index - 1] : null;
              const showHeader =
                !previousMessage ||
                previousMessage.user.id !== message.user.id ||
                new Date(message.createdAt).getTime() -
                  new Date(previousMessage.createdAt).getTime() >
                  60000; // 1 minute

              return (
                <ChatMessageItem
                  key={message.id}
                  message={message}
                  isOwnMessage={message.user.id === currentUserId}
                  showHeader={showHeader}
                  previousMessage={previousMessage || undefined}
                />
              );
            })
          )}
        </div>

        {/* Message Input */}
        <div className="flex items-center gap-2">
          <Input
            placeholder={
              isConnected ? "Type a message..." : "Connecting to chat..."
            }
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={!isConnected}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!isConnected || !messageInput.trim()}
          >
            <IconSend className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
