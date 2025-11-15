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
  IconChevronDown,
  IconChevronUp,
  IconSparkles,
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
}: ChatAreaProps) {
  const [messageInput, setMessageInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  const { messages, isConnected, sendMessage, broadcastRoomDeleted } =
    useRealtimeChat({
      roomId,
      userId: currentUserId,
      userName: currentUserName,
      displayUsername: currentUserDisplayUsername,
      initialMessages,
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
    <Card
      className={`rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg ${
        isMinimized ? "flex flex-col chat-minimized" : "h-full flex flex-col"
      }`}
    >
      <CardHeader className="pb-4 border-b border-foreground/5">
        <CardTitle className="flex items-center justify-between text-lg font-bold">
          <div className="flex items-center gap-3">
            <div className="relative">
              <IconMessage className="w-5 h-5 text-primary" />
              <IconSparkles className="w-3 h-3 text-primary absolute -top-1 -right-1 animate-pulse" />
            </div>
            {isMinimized && messages.length > 0 && (
              <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-[10px] rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center">
                {messages.length}
              </Badge>
            )}
            <span className="sr-only">
              Room Chat
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={isConnected ? "default" : "secondary"}
              className={`text-xs rounded-full transition-all ${
                isConnected
                  ? "bg-primary/20 text-primary border-primary/30"
                  : "bg-muted text-muted-foreground"
              }`}
              suppressHydrationWarning
            >
              {isConnected ? (
                <>
                  <IconWifi className="w-3 h-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <IconWifiOff className="w-3 h-3 mr-1 animate-pulse" />
                  Connecting...
                </>
              )}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-7 w-7 rounded-full hover:bg-background/50 transition-all"
            >
              {isMinimized ? (
                <IconChevronUp className="w-4 h-4" />
              ) : (
                <IconChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Messages Area */}
          <div
            ref={containerRef}
            className="flex-1 space-y-1 overflow-y-auto min-h-0 pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/30"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'hsl(var(--primary) / 0.2) transparent',
            }}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                  <IconMessage className="w-12 h-12 text-primary relative z-10" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  No messages yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Start the conversation and get the party going! 🎉
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

                // Check if we need to show a date separator
                const messageDate = new Date(message.createdAt);
                const prevDate = previousMessage ? new Date(previousMessage.createdAt) : null;
                const showDateSeparator = !prevDate || 
                  messageDate.getDate() !== prevDate.getDate() ||
                  messageDate.getMonth() !== prevDate.getMonth() ||
                  messageDate.getFullYear() !== prevDate.getFullYear();

                return (
                  <ChatMessageItem
                    key={message.id}
                    message={message}
                    isOwnMessage={message.user.id === currentUserId}
                    showHeader={showHeader}
                    previousMessage={previousMessage || undefined}
                    showDateSeparator={showDateSeparator}
                  />
                );
              })
            )}
          </div>

          {/* Message Input */}
          <div className="flex items-end gap-2 pt-3 border-t border-foreground/5 bg-background/20 backdrop-blur-sm -mx-6 -mb-6 px-6 pb-4 rounded-b-2xl">
            <div className="flex-1 relative">
              <Input
                placeholder={
                  isConnected ? "Type a message..." : "Connecting to chat..."
                }
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={!isConnected}
                className="flex-1 rounded-xl bg-background/60 border-foreground/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all pr-12 py-6 text-sm placeholder:text-muted-foreground/60"
                maxLength={500}
              />
              {messageInput.length > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/70 font-medium">
                  {messageInput.length}/500
                </span>
              )}
            </div>
            <Button
              variant="modern"
              size="modern-sm"
              onClick={handleSendMessage}
              disabled={!isConnected || !messageInput.trim()}
              className="rounded-full shrink-0 disabled:opacity-50 disabled:cursor-not-allowed h-12 w-12 shadow-lg hover:shadow-xl transition-all"
            >
              <IconSend className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
