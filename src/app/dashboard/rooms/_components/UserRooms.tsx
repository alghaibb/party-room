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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 animate-pulse">
            <CardContent className="p-5">
              <div className="h-4 w-32 bg-muted/50 rounded mb-2" />
              <div className="h-3 w-24 bg-muted/50 rounded mb-4" />
              <div className="h-9 w-full bg-muted/50 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (userRooms.length === 0) {
    return (
      <Card className="rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 p-8">
        <div className="text-center space-y-3">
          <p className="text-muted-foreground/80 font-medium">
            You haven&apos;t joined any rooms yet
          </p>
          <p className="text-sm text-muted-foreground/60">
            Browse active rooms below to get started!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {userRooms.map((room) => (
        <Card key={room.id} className="rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2 flex-1">
                <h4 className="font-bold text-base">{room.name}</h4>
                {room.description && (
                  <p className="text-xs text-muted-foreground/80 line-clamp-1">
                    {room.description}
                  </p>
                )}
              </div>
              <Badge variant="outline" className="text-xs rounded-full border-foreground/20 font-mono">
                {room.code}
              </Badge>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Avatar className="w-6 h-6">
                <AvatarImage src={room.owner.image || ""} />
                <AvatarFallback className="text-xs">
                  {room.owner.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <IconCrown className="w-4 h-4 text-yellow-600" />
              <span className="text-xs text-muted-foreground/80 font-medium">
                {room.owner.name}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
                <IconUsers className="w-4 h-4" />
                <span className="font-medium">
                  {room.currentPlayers}/{room.maxPlayers}
                </span>
                {room.isOnline && (
                  <Badge variant="secondary" className="text-xs ml-2 rounded-full">
                    Online
                  </Badge>
                )}
              </div>

              <Button asChild size="modern-sm" variant="modern-outline">
                <Link href={`/dashboard/rooms/${room.id}`}>Rejoin</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
