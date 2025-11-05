import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconUsers, IconCrown, IconCircle } from "@tabler/icons-react";

interface PlayerListProps {
  members: Array<{
    id: string;
    userId: string;
    joinedAt: Date;
    isOnline: boolean;
    user: {
      id: string;
      name: string;
      username: string | null;
      image: string | null;
    };
  }>;
  owner: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
  };
  maxPlayers: number;
  currentUserId: string;
}

export function PlayerList({
  members,
  owner,
  maxPlayers,
  currentUserId,
}: PlayerListProps) {
  const onlineMembers = members.filter((member) => member.isOnline);
  const offlineMembers = members.filter((member) => !member.isOnline);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <IconUsers className="w-4 h-4" />
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
                        {member.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {member.user.name}
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
                        {member.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {member.user.name}
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
