import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import { getRoomDetails, getAvailableGames, getRoomMessages } from "./data";
import { RoomHeader } from "./_components/RoomHeader";
import { PlayerList } from "./_components/PlayerList";
import { GameArea } from "./_components/GameArea";
import { ChatArea } from "./_components/ChatArea";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";

interface RoomPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export async function generateMetadata({
  params,
}: RoomPageProps): Promise<Metadata> {
  const { roomId } = await params;

  try {
    const room = await getRoomDetails(roomId);

    return {
      title: room.name,
      description:
        room.description ||
        `Join ${room.name} with ${room.memberCount} ${room.memberCount === 1 ? "player" : "players"}. ${room.isPublic ? "Public room" : "Private room"} hosted by ${room.owner.name}.`,
      openGraph: {
        title: room.name,
        description:
          room.description ||
          `Join this party room with ${room.memberCount} players!`,
        type: "website",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Room Not Found | Party Room",
      description: "This room could not be found or is no longer available.",
    };
  }
}

export default async function RoomPage({ params }: RoomPageProps) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (!session.user.emailVerified) {
    redirect("/verify-email");
  }

  // Fetch room data outside of JSX
  const { roomId } = await params;
  let room;
  try {
    room = await getRoomDetails(roomId);
  } catch (error) {
    // Handle room not found or access denied
    console.error("Error fetching room details:", error);
    redirect("/dashboard/rooms");
  }

  const availableGames = await getAvailableGames();
  const messages = await getRoomMessages(room.id);

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex flex-1 flex-col lg:flex-row gap-6 p-4 md:p-6 h-full min-h-0">
        {/* Left Column - Room Info & Players */}
        <div className="lg:w-80 flex flex-col gap-4">
          {/* Room Header */}
          <RoomHeader room={room} />

          {/* Player List */}
          <div className="flex-1">
            <Suspense fallback={<Skeleton className="h-64 rounded-lg" />}>
              <PlayerList
                members={room.members}
                owner={room.owner}
                maxPlayers={room.maxPlayers}
                currentUserId={room.currentUserId}
              />
            </Suspense>
          </div>
        </div>

        {/* Right Column - Game Area & Chat */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Game Area */}
          <div className="flex-1">
            <Suspense fallback={<Skeleton className="h-96 rounded-lg" />}>
              <GameArea room={room} availableGames={availableGames} />
            </Suspense>
          </div>

          {/* Chat Area */}
          <div className="h-80 lg:h-64">
            <Suspense fallback={<Skeleton className="h-full rounded-lg" />}>
              <ChatArea
                roomId={room.id}
                roomName={room.name}
                currentUserId={room.currentUserId}
                messages={messages}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
