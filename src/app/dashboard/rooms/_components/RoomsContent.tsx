import { RoomGrid } from "./RoomGrid";
import { RoomStats } from "./RoomStats";
import { UserRooms } from "./UserRooms";

export async function RoomsContent() {
  return (
    <>
      <RoomStats />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Recent Rooms</h2>
        <UserRooms />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active Rooms</h2>
          <p className="text-sm text-muted-foreground">
            Join any public room to start playing
          </p>
        </div>
        <RoomGrid />
      </div>
    </>
  );
}
