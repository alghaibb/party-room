import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconMessage, IconSend } from "@tabler/icons-react";

interface ChatAreaProps {
  roomId: string;
  roomName: string;
  currentUserId: string;
}

export function ChatArea({ roomName }: ChatAreaProps) {
  // For now, we'll show a placeholder chat
  // TODO: Implement real-time chat with WebSockets or similar

  // Fixed timestamps for stable rendering
  const mockMessages = [
    {
      id: "1",
      user: { name: "Alice", image: null },
      message: "Hey everyone! Ready to play?",
      timestamp: new Date("2024-01-01T12:00:00Z"),
    },
    {
      id: "2",
      user: { name: "Bob", image: null },
      message: "Let's do some trivia!",
      timestamp: new Date("2024-01-01T12:02:00Z"),
    },
    {
      id: "3",
      user: { name: "Charlie", image: null },
      message: "I'm ready 🎮",
      timestamp: new Date("2024-01-01T12:04:00Z"),
    },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <IconMessage className="w-4 h-4" />
          Room Chat
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
        {/* Messages Area */}
        <div className="flex-1 space-y-3 overflow-y-auto min-h-0 pr-2">
          {mockMessages.map((message) => (
            <div key={message.id} className="flex items-start gap-2">
              <Avatar className="w-6 h-6 mt-1">
                <AvatarImage src={message.user.image || ""} />
                <AvatarFallback className="text-xs">
                  {message.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {message.user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm wrap-break-word">{message.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex gap-2 pt-3 border-t">
          <Input
            placeholder={`Message ${roomName}...`}
            className="flex-1"
            disabled // TODO: Enable when chat is implemented
          />
          <Button size="icon" disabled>
            <IconSend className="w-4 h-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>

        {/* Temporary Notice */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            💬 Real-time chat coming soon! For now, coordinate games with your
            party.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
