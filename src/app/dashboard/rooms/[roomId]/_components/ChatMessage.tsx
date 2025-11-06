import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/hooks/use-realtime-chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageItemProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showHeader: boolean;
  previousMessage?: ChatMessage;
}

export function ChatMessageItem({
  message,
  isOwnMessage,
  showHeader,
}: ChatMessageItemProps) {
  const isSystemMessage = message.user.id === "system";

  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-muted-foreground italic">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-start gap-2 mb-3", {
        "flex-row-reverse": isOwnMessage,
      })}
    >
      {showHeader && (
        <Avatar className="w-6 h-6 mt-1">
          <AvatarImage src="" />
          <AvatarFallback className="text-xs">
            {message.user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      {!showHeader && <div className="w-6" />}

      <div
        className={cn("flex flex-col gap-1 max-w-[75%]", {
          "items-end": isOwnMessage,
        })}
      >
        {showHeader && (
          <div
            className={cn("flex items-center gap-2 text-xs px-2", {
              "flex-row-reverse": isOwnMessage,
            })}
          >
            <span className="font-medium">{message.user.name}</span>
            <span className="text-muted-foreground" suppressHydrationWarning>
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
        <div
          className={cn(
            "py-2 px-3 rounded-xl text-sm w-fit wrap-break-word",
            isOwnMessage
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
