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
import { isRedirectError } from "next/dist/client/components/redirect-error";

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
    // If it's a redirect error, let it propagate
    if (isRedirectError(error)) {
      throw error;
    }
    // Handle other errors
    console.error("Error fetching room details:", error);
    redirect("/dashboard/rooms");
  }

  const availableGames = await getAvailableGames();
  const dbMessages = await getRoomMessages(room.id);

  // Convert database messages to ChatMessage format
  const initialMessages = dbMessages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    user: {
      id: msg.user.id,
      name: msg.user.name,
    },
    createdAt: msg.createdAt.toISOString(),
  }));

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
                roomId={room.id}
                members={room.members.map((m) => ({
                  ...m,
                  user: {
                    ...m.user,
                    displayUsername:
                      (
                        m.user as typeof m.user & {
                          displayUsername: string | null;
                        }
                      ).displayUsername || m.user.name,
                  },
                }))}
                owner={{
                  ...room.owner,
                  displayUsername:
                    (
                      room.owner as typeof room.owner & {
                        displayUsername: string | null;
                      }
                    ).displayUsername || room.owner.name,
                }}
                maxPlayers={room.maxPlayers}
                currentUserId={session.user.id}
                currentUserName={session.user.name}
                currentUserDisplayUsername={
                  session.user.displayUsername || session.user.name
                }
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
                currentUserId={session.user.id}
                currentUserName={session.user.name}
                currentUserDisplayUsername={
                  session.user.displayUsername || session.user.name
                }
                initialMessages={initialMessages}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
