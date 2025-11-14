"use client";

import { useQuery } from "@tanstack/react-query";
import { RoomHeader } from "./RoomHeader";
import { PlayerList } from "./PlayerList";
import { GameArea } from "./GameArea";
import { ChatArea } from "./ChatArea";
import { useRoomDetails } from "@/hooks/queries/use-room-details";
import { useRoomMessages } from "@/hooks/queries/use-room-messages";
import { useAvailableGames } from "@/hooks/queries/use-available-games";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface RoomContentProps {
  roomId: string;
}

async function fetchSession() {
  const response = await fetch("/api/auth/session");
  if (!response.ok) return null;
  return response.json();
}

export function RoomContent({ roomId }: RoomContentProps) {
  const { data: room } = useRoomDetails(roomId);
  const { data: availableGames } = useAvailableGames();
  const { data: dbMessages } = useRoomMessages(roomId);
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
  });

  // Show loader only when there's no cached data (first load)
  if (
    room === undefined ||
    availableGames === undefined ||
    session === undefined
  ) {
    return (
      <div className="flex flex-1 flex-col lg:flex-row gap-6 p-4 md:p-6 h-full min-h-0">
        <div className="lg:w-80 flex flex-col gap-4">
          <Card>
            <CardHeader className="space-y-3">
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
          </Card>
          <Card>
            <CardContent className="space-y-3 pt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <Card className="flex-1">
            <CardContent className="pt-6">
              <div className="h-64 w-full bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        </div>

        <div className="lg:w-80 flex flex-col gap-4">
          <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 flex flex-col pt-6">
              <div className="flex-1 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-full bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-10 w-full mt-4 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const initialMessages = (dbMessages || []).map((msg) => ({
    id: msg.id,
    content: msg.content,
    user: {
      id: msg.user.id,
      name: msg.user.name,
    },
    createdAt:
      typeof msg.createdAt === "string"
        ? msg.createdAt
        : new Date(msg.createdAt).toISOString(),
  }));

  return (
    <>
      <div className="lg:w-80 flex flex-col gap-4">
        <RoomHeader room={room} />

        <div className="flex-1">
          <PlayerList
            roomId={room.id}
            members={room.members.map((m) => ({
              ...m,
              user: {
                ...m.user,
                displayUsername:
                  (m.user as typeof m.user & { displayUsername: string | null })
                    .displayUsername || m.user.name,
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
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 min-h-0 has-[.chat-minimized]:gap-0">
        <div className="flex-1 min-h-0 has-[~_.chat-minimized]:flex-none has-[~_.chat-minimized]:h-full">
          <GameArea room={room} availableGames={availableGames} />
        </div>
        <div className="shrink-0">
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
        </div>
      </div>
    </>
  );
}
