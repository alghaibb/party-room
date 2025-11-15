import { cn } from "@/lib/utils";
import { useState } from "react";
import type { ChatMessage } from "@/hooks/use-realtime-chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  IconCopy,
  IconCheck,
} from "@tabler/icons-react";

interface ChatMessageItemProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showHeader: boolean;
  previousMessage?: ChatMessage;
  showDateSeparator?: boolean;
}

export function ChatMessageItem({
  message,
  isOwnMessage,
  showHeader,
  previousMessage,
  showDateSeparator = false,
}: ChatMessageItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const isSystemMessage = message.user.id === "system";

  const messageDate = new Date(message.createdAt);
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isYesterday = (date: Date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    }).format(date);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-3">
        <span className="text-xs text-muted-foreground/80 italic bg-background/30 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <>
      {showDateSeparator && (
        <div className="flex items-center justify-center my-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background/40 backdrop-blur-sm border border-foreground/10 rounded-full">
            <span className="text-xs font-medium text-muted-foreground">
              {formatDate(messageDate)}
            </span>
          </div>
        </div>
      )}
      <div
        className={cn("flex items-start gap-2 mb-3 group animate-in fade-in slide-in-from-bottom-2 duration-300", {
          "flex-row-reverse": isOwnMessage,
        })}
      >
      {showHeader && (
        <Avatar className="w-8 h-8 mt-1 border-2 border-foreground/10 shadow-md ring-2 ring-primary/20">
          <AvatarImage src="" />
          <AvatarFallback className="text-xs bg-[linear-gradient(135deg,var(--primary),var(--accent))] text-primary-foreground font-bold">
            {message.user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      {!showHeader && <div className="w-8" />}

      <div
        className={cn("flex flex-col gap-1 max-w-[75%] relative", {
          "items-end": isOwnMessage,
        })}
      >
        {showHeader && (
          <div
            className={cn("flex items-center gap-2 text-xs px-2 mb-1.5", {
              "flex-row-reverse": isOwnMessage,
            })}
          >
            <span className="font-semibold text-foreground">
              {message.user.name}
            </span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span
              className="text-muted-foreground/70 text-[10px] font-medium"
              suppressHydrationWarning
              title={formatDateTime(messageDate)}
            >
              {(() => {
                const prevDate = previousMessage ? new Date(previousMessage.createdAt) : null;
                const showDate = !prevDate || 
                  messageDate.getDate() !== prevDate.getDate() ||
                  messageDate.getMonth() !== prevDate.getMonth() ||
                  messageDate.getFullYear() !== prevDate.getFullYear();
                
                if (showDate) {
                  return `${formatDate(messageDate)} • ${new Intl.DateTimeFormat("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }).format(messageDate)}`;
                }
                return new Intl.DateTimeFormat("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }).format(messageDate);
              })()}
            </span>
          </div>
        )}
        <div
          className={cn("relative group/message", {
            "pr-12": !isOwnMessage,
            "pl-12": isOwnMessage,
          })}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={cn(
              "py-2.5 px-4 rounded-2xl text-sm w-fit wrap-break-word transition-all shadow-sm hover:shadow-md",
              isOwnMessage
                ? "bg-[linear-gradient(135deg,var(--primary),var(--accent))] text-primary-foreground shadow-primary/20 hover:shadow-primary/30"
                : "bg-background/60 backdrop-blur-sm border border-foreground/10 text-foreground shadow-md hover:border-foreground/20"
            )}
          >
            {message.content}
          </div>
          {isHovered && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className={cn(
                "absolute h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm border border-foreground/10 shadow-lg hover:bg-background transition-all z-10 top-1/2 -translate-y-1/2",
                isOwnMessage ? "left-0 -translate-x-2" : "right-0 translate-x-2"
              )}
            >
              {isCopied ? (
                <IconCheck className="w-4 h-4 text-primary" />
              ) : (
                <IconCopy className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
