import { getRoomStats } from "../data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconHome, IconUsers, IconDeviceGamepad } from "@tabler/icons-react";

export async function RoomStats() {
  const stats = await getRoomStats();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Rooms</CardTitle>
          <IconHome className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalActiveRooms}</div>
          <p className="text-xs text-muted-foreground">
            Rooms available to join
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Players Online</CardTitle>
          <IconUsers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalActivePlayers}</div>
          <p className="text-xs text-muted-foreground">
            Players in active rooms
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Games Playing</CardTitle>
          <IconDeviceGamepad className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.gamesInProgress}</div>
          <p className="text-xs text-muted-foreground">
            Games currently active
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
