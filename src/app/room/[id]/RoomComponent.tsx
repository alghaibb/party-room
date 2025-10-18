"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Users, Wifi, WifiOff } from "lucide-react";
import type { User as AuthUser } from "@/lib/auth";

interface Message {
  id: string;
  content: string;
  type: "TEXT" | "SYSTEM" | "GAME" | "EMOJI";
  createdAt: string;
  user: {
    id: string;
    displayName: string;
    username?: string;
  };
}

interface User {
  userId: string;
  displayName: string;
  status?: "online" | "away" | "busy";
}

interface RoomUser {
  userId: string;
  displayName: string;
  status?: "online" | "away" | "busy";
}

interface RoomComponentProps {
  roomId: string;
  user: AuthUser;
}

export function RoomComponent({ roomId, user }: RoomComponentProps) {
  const { isConnected, joinRoom, leaveRoom, sendMessage, on, off } =
    useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  const displayName =
    user.displayUsername || user.name || user.username || "Anonymous";

  // Join room on mount
  useEffect(() => {
    if (isConnected && !isJoined) {
      joinRoom(roomId, user.id);
      setIsJoined(true);
    }

    return () => {
      if (isJoined) {
        leaveRoom(roomId, user.id);
        setIsJoined(false);
      }
    };
  }, [isConnected, isJoined, roomId, user.id, joinRoom, leaveRoom]);

  // Listen for messages
  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleRoomUsers = (users: RoomUser[]) => {
      setRoomUsers(users);
    };

    const handleUserJoined = (data: {
      userId: string;
      displayName: string;
    }) => {
      // Add system message
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        content: `${data.displayName} joined the room`,
        type: "SYSTEM",
        createdAt: new Date().toISOString(),
        user: { id: "system", displayName: "System" },
      };
      setMessages((prev) => [...prev, systemMessage]);
    };

    const handleUserLeft = (data: { userId: string }) => {
      // Add system message
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        content: `${data.userId} left the room`,
        type: "SYSTEM",
        createdAt: new Date().toISOString(),
        user: { id: "system", displayName: "System" },
      };
      setMessages((prev) => [...prev, systemMessage]);
    };

    on("new-message", handleNewMessage);
    on("room-users", handleRoomUsers);
    on("user-joined", handleUserJoined);
    on("user-left", handleUserLeft);

    return () => {
      off("new-message", handleNewMessage);
      off("room-users", handleRoomUsers);
      off("user-joined", handleUserJoined);
      off("user-left", handleUserLeft);
    };
  }, [on, off]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    sendMessage(roomId, user.id, newMessage.trim());
    setNewMessage("");
  };

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-4">
      {/* Main Chat Area */}
      <div className="lg:col-span-3">
        <Card className="flex h-[600px] flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span>Party Room - {roomId.slice(0, 8)}</span>
                {isConnected ? (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Wifi className="h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <WifiOff className="h-3 w-3" />
                    Disconnected
                  </Badge>
                )}
              </CardTitle>
              <div className="text-muted-foreground text-sm">
                Welcome, {displayName}
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex flex-1 flex-col p-0">
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 py-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex flex-col">
                    {message.type === "SYSTEM" ? (
                      <div className="text-muted-foreground text-center text-sm italic">
                        {message.content}
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {message.user.displayName}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="bg-muted max-w-md rounded-lg px-3 py-2">
                          {message.content}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="text-muted-foreground py-8 text-center">
                    No messages yet. Start the conversation!
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={!isConnected || !isJoined}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={!isConnected || !isJoined || !newMessage.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Sidebar */}
      <div className="lg:col-span-1">
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Room Users ({roomUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {roomUsers.map((roomUser) => (
                  <div
                    key={roomUser.userId}
                    className="bg-muted/50 flex items-center gap-2 rounded-lg p-2"
                  >
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">{roomUser.displayName}</span>
                  </div>
                ))}
                {roomUsers.length === 0 && (
                  <div className="text-muted-foreground py-4 text-center text-sm">
                    No users in room
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
