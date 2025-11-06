import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconMessage, IconSend } from "@tabler/icons-react";
import { getRoomMessages } from "../data";

interface ChatAreaProps {
  roomId: string;
  roomName: string;
  currentUserId: string;
  messages?: Awaited<ReturnType<typeof getRoomMessages>>;
}

export function ChatArea({ currentUserId, messages = [] }: ChatAreaProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <IconMessage className="w-4 h-4" />
            Room Chat
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
        {/* Messages Area */}
        <div className="flex-1 space-y-3 overflow-y-auto min-h-0 pr-2">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <IconMessage className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((message) => (
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
                      {message.userId === currentUserId && (
                        <span className="text-muted-foreground"> (You)</span>
                      )}
                    </span>
                    <span
                      className="text-xs text-muted-foreground"
                      suppressHydrationWarning
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm wrap-break-word">{message.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Message est..."
            value=""
            disabled
            className="flex-1"
          />
          <Button size="icon" disabled>
            <IconSend className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
