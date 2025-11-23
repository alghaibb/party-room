"use client";

import { useEffect, useRef } from "react";
import { RoomHeader } from "./RoomHeader";
import { PlayerList } from "./PlayerList";
import { GameArea } from "./GameArea";
import { ChatArea } from "./ChatArea";
import { useRoomDetails } from "@/hooks/queries/use-room-details";
import { useRoomMessages } from "@/hooks/queries/use-room-messages";
import { useAvailableGames } from "@/hooks/queries/use-available-games";
import { useSession } from "@/hooks/queries/use-session";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { updateMemberOnlineStatus } from "../actions";
import {
  transformMessages,
  transformMembersForGameArea,
  transformMembersForPlayerList,
  getDisplayUsername,
} from "@/lib/room-data-transformers";
import { RoomEventsProvider } from "@/contexts/room-events-context";

interface RoomContentProps {
  roomId: string;
}

export function RoomContent({ roomId }: RoomContentProps) {
  const { data: room } = useRoomDetails(roomId);
  const { data: availableGames } = useAvailableGames();
  const { data: dbMessages } = useRoomMessages(roomId);
  const { data: session } = useSession();
  const broadcastRoomDeletedRef = useRef<((ownerName: string) => void) | null>(
    null
  );

  // Update online status when entering the room
  useEffect(() => {
    if (room && session?.user) {
      // Mark user as online when entering room
      updateMemberOnlineStatus(roomId, true).catch((error) => {
        console.error("Failed to update online status:", error);
      });

      // Mark user as offline when leaving room
      return () => {
        updateMemberOnlineStatus(roomId, false).catch((error) => {
          console.error("Failed to update online status:", error);
        });
      };
    }
  }, [roomId, room, session?.user]);

  // Show loader only when there's no cached data (first load)
  // Note: dbMessages can be undefined initially, but we don't block rendering for it
  // since messages will load asynchronously and update via initialMessages prop
  if (
    room === undefined ||
    availableGames === undefined ||
    !session ||
    !session.user
  ) {
    return (
      <div className="flex flex-1 flex-col md:flex-row gap-4 md:gap-6 h-full min-h-0">
        <div className="md:w-80 lg:w-96 flex flex-col gap-4">
          <Card className="rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10">
            <CardHeader className="space-y-3">
              <div className="h-7 w-40 bg-muted/50 animate-pulse rounded" />
              <div className="h-4 w-32 bg-muted/50 animate-pulse rounded" />
            </CardHeader>
          </Card>
          <Card className="rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10">
            <CardContent className="space-y-3 pt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted/50 animate-pulse rounded-full" />
                  <div className="h-4 w-36 bg-muted/50 animate-pulse rounded" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <Card className="flex-1 rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10">
            <CardContent className="pt-6">
              <div className="h-64 w-full bg-muted/50 animate-pulse rounded-2xl" />
            </CardContent>
          </Card>
        </div>

        <div className="md:w-80 lg:w-96 flex flex-col gap-4">
          <Card className="flex-1 flex flex-col rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10">
            <CardContent className="flex-1 flex flex-col pt-6">
              <div className="flex-1 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-10 h-10 bg-muted/50 animate-pulse rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 bg-muted/50 animate-pulse rounded" />
                      <div className="h-4 w-full bg-muted/50 animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-11 w-full mt-4 bg-muted/50 animate-pulse rounded-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const members =
    room && typeof room === "object" && "members" in room
      ? Array.isArray(room.members)
        ? room.members
        : []
      : [];
  const gamesArray = Array.isArray(availableGames) ? availableGames : [];

  // Defensive check: ensure room exists and has required properties
  if (!room || typeof room !== "object" || !room.id) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading room data...</p>
        </div>
      </div>
    );
  }

  const initialMessages = transformMessages(dbMessages);
  const transformedMembers = transformMembersForPlayerList(members);
  const gameAreaMembers = transformMembersForGameArea(members);

  return (
    <RoomEventsProvider
      broadcastRoomDeleted={(ownerName) => {
        broadcastRoomDeletedRef.current?.(ownerName);
      }}
    >
      <div className="md:w-80 lg:w-96 flex flex-col gap-4">
        <RoomHeader room={room} />

        <div className="flex-1">
          <PlayerList
            roomId={room.id}
            members={transformedMembers}
            owner={{
              ...room.owner,
              displayUsername: getDisplayUsername(room.owner),
            }}
            maxPlayers={room.maxPlayers}
            currentUserId={session.user.id}
            currentUserName={session.user.name}
            currentUserDisplayUsername={getDisplayUsername(session.user)}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 min-h-0 has-[.chat-minimized]:gap-0">
        <div className="flex-1 min-h-0 has-[~_.chat-minimized]:flex-none has-[~_.chat-minimized]:h-full">
          <GameArea
            room={{
              ...room,
              currentUserId: session.user.id,
              currentUserName: session.user.name,
              currentUserDisplayUsername: getDisplayUsername(session.user),
              members: gameAreaMembers,
            }}
            availableGames={gamesArray}
          />
        </div>
        <div className="h-64 sm:h-80 md:h-96 has-[.chat-minimized]:h-auto">
          <ChatArea
            roomId={room.id}
            roomName={room.name}
            currentUserId={session.user.id}
            currentUserName={session.user.name}
            currentUserDisplayUsername={getDisplayUsername(session.user)}
            initialMessages={initialMessages}
            onBroadcastRoomDeletedReady={(fn) => {
              broadcastRoomDeletedRef.current = fn;
            }}
          />
        </div>
      </div>
    </RoomEventsProvider>
  );
}
