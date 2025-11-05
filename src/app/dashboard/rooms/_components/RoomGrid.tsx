import { getActiveRooms } from "../data";
import { getSession } from "@/lib/get-session";
import { RoomCard } from "./RoomCard";

export async function RoomGrid() {
  const rooms = await getActiveRooms();
  const session = await getSession();
  const isVerified = session?.user?.emailVerified || false;
  const currentUserId = session?.user?.id;

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🎮</span>
        </div>
        <h3 className="font-semibold text-lg mb-2">No Active Rooms</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Be the first to create a party room and get the fun started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          isVerified={isVerified}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
