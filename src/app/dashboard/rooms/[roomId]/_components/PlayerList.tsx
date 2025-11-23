"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconUsers, IconCrown, IconCircle } from "@tabler/icons-react";
import { useRoomPresence } from "@/hooks/use-room-presence";

interface PlayerListProps {
  roomId: string;
  members: Array<{
    id: string;
    userId: string;
    joinedAt: Date;
    isOnline: boolean;
    user: {
      id: string;
      name: string;
      displayUsername: string | null;
      username: string | null;
      image: string | null;
    };
  }>;
  owner: {
    id: string;
    name: string;
    displayUsername: string | null;
    username: string | null;
    image: string | null;
  };
  maxPlayers: number;
  currentUserId: string;
  currentUserName: string;
  currentUserDisplayUsername: string;
}

export function PlayerList({
  roomId,
  members,
  owner,
  maxPlayers,
  currentUserId,
  currentUserName,
  currentUserDisplayUsername,
}: PlayerListProps) {
  const { onlineUsers, isConnected } = useRoomPresence({
    roomId,
    userId: currentUserId,
    userName: currentUserName,
    displayUsername: currentUserDisplayUsername,
  });

  // Update members' online status based on presence
  // If presence is connected, use presence data; otherwise fall back to database isOnline
  const updatedMembers = members.map((member) => {
    if (isConnected && onlineUsers.length > 0) {
      // Use Supabase presence if connected and we have presence data
      return {
        ...member,
        isOnline: onlineUsers.some((u) => u.userId === member.userId),
      };
    } else {
      // Fall back to database isOnline status
      return member;
    }
  });

  const onlineMembers = updatedMembers.filter((member) => member.isOnline);
  const offlineMembers = updatedMembers.filter((member) => !member.isOnline);

  return (
    <Card className="h-full rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-bold">
          <IconUsers className="w-5 h-5 text-primary" />
          Players ({members.length}/{maxPlayers})
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Online Players */}
        {onlineMembers.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm font-medium text-green-600">
                Online ({onlineMembers.length})
              </span>
            </div>
            <div className="space-y-2">
              {onlineMembers.map((member) => {
                const isOwner = member.userId === owner.id;
                const isCurrentUser = member.userId === currentUserId;

                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={member.user.image || ""} />
                      <AvatarFallback className="text-sm">
                        {(member.user.displayUsername || member.user.name)
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {member.user.displayUsername || member.user.name}
                          {isCurrentUser && (
                            <span className="text-muted-foreground">
                              {" "}
                              (You)
                            </span>
                          )}
                        </p>
                        {isOwner && (
                          <IconCrown className="w-3 h-3 text-yellow-600 shrink-0" />
                        )}
                      </div>
                      {member.user.username && (
                        <p className="text-xs text-muted-foreground truncate">
                          @{member.user.username}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <IconCircle className="w-2 h-2 text-green-500 fill-current" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Offline Players */}
        {offlineMembers.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className="text-sm font-medium text-gray-600">
                Offline ({offlineMembers.length})
              </span>
            </div>
            <div className="space-y-2">
              {offlineMembers.map((member) => {
                const isOwner = member.userId === owner.id;
                const isCurrentUser = member.userId === currentUserId;

                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-lg opacity-60"
                  >
                    <Avatar className="w-8 h-8 grayscale">
                      <AvatarImage src={member.user.image || ""} />
                      <AvatarFallback className="text-sm">
                        {(member.user.displayUsername || member.user.name)
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {member.user.displayUsername || member.user.name}
                          {isCurrentUser && (
                            <span className="text-muted-foreground">
                              {" "}
                              (You)
                            </span>
                          )}
                        </p>
                        {isOwner && (
                          <IconCrown className="w-3 h-3 text-yellow-600/60 shrink-0" />
                        )}
                      </div>
                      {member.user.username && (
                        <p className="text-xs text-muted-foreground truncate">
                          @{member.user.username}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <IconCircle className="w-2 h-2 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty Slots */}
        {members.length < maxPlayers && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-muted rounded-full" />
              <span className="text-sm font-medium text-muted-foreground">
                Available Slots ({maxPlayers - members.length})
              </span>
            </div>
            <div className="space-y-2">
              {Array.from({ length: maxPlayers - members.length }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg border-2 border-dashed border-muted"
                  >
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <IconUsers className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Waiting for player...
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
