"use client";

import { useUserRooms } from "@/hooks/queries/use-user-rooms";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconCrown, IconUsers } from "@tabler/icons-react";

export function UserRooms() {
  const { data: userRooms } = useUserRooms();

  // Show loader only when there's no cached data (first load)
  if (userRooms === undefined) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 w-32 bg-muted rounded mb-2" />
              <div className="h-3 w-24 bg-muted rounded mb-4" />
              <div className="h-8 w-full bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (userRooms.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">
            You haven&apos;t joined any rooms yet
          </p>
          <p className="text-sm text-muted-foreground">
            Browse active rooms below to get started!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {userRooms.map((room) => (
        <Card key={room.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1 flex-1">
                <h4 className="font-medium text-sm">{room.name}</h4>
                {room.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {room.description}
                  </p>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {room.code}
              </Badge>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Avatar className="w-5 h-5">
                <AvatarImage src={room.owner.image || ""} />
                <AvatarFallback className="text-xs">
                  {room.owner.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <IconCrown className="w-3 h-3 text-yellow-600" />
              <span className="text-xs text-muted-foreground">
                {room.owner.name}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <IconUsers className="w-3 h-3" />
                <span>
                  {room.currentPlayers}/{room.maxPlayers}
                </span>
                {room.isOnline && (
                  <Badge variant="secondary" className="text-xs ml-2">
                    Online
                  </Badge>
                )}
              </div>

              <Button asChild size="sm" variant="outline">
                <Link href={`/dashboard/rooms/${room.id}`}>Rejoin</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
