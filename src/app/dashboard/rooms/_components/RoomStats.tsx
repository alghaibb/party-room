"use client";

import { useRoomStats } from "@/hooks/queries/use-room-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconHome, IconUsers, IconDeviceGamepad } from "@tabler/icons-react";

export function RoomStats() {
  const { data: stats } = useRoomStats();

  // Show loader only when there's no cached data (first load)
  if (stats === undefined) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="h-4 w-24 bg-muted/50 animate-pulse rounded" />
              <div className="h-5 w-5 bg-muted/50 animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-10 w-20 bg-muted/50 animate-pulse rounded mt-2" />
              <div className="h-4 w-32 bg-muted/50 animate-pulse rounded mt-3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <Card className="rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60">
            Active Rooms
          </CardTitle>
          <IconHome className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black bg-[linear-gradient(135deg,var(--primary),var(--accent))] bg-clip-text text-transparent">
            {stats.totalActiveRooms}
          </div>
          <p className="text-sm text-muted-foreground/80 mt-2">
            Rooms available to join
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60">
            Players Online
          </CardTitle>
          <IconUsers className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black bg-[linear-gradient(135deg,var(--primary),var(--accent))] bg-clip-text text-transparent">
            {stats.totalActivePlayers}
          </div>
          <p className="text-sm text-muted-foreground/80 mt-2">
            Players in active rooms
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60">
            Games Playing
          </CardTitle>
          <IconDeviceGamepad className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black bg-[linear-gradient(135deg,var(--primary),var(--accent))] bg-clip-text text-transparent">
            {stats.gamesInProgress}
          </div>
          <p className="text-sm text-muted-foreground/80 mt-2">
            Games currently active
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
