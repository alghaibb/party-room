"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GAME_EVENTS,
  GAME_MESSAGES,
  GAME_SESSION_STATUS,
} from "@/constants/game";
import { useInvalidateRooms } from "@/hooks/queries/use-invalidate-rooms";
import { useRoomDetails } from "@/hooks/queries/use-room-details";
import {
  useRealtimeGame,
  type GameSessionData,
} from "@/hooks/use-realtime-game";
import { useRoomPresence } from "@/hooks/use-room-presence";
import { gameRegistry } from "@/lib/games";
import { registerAllGames } from "@/lib/games/register-games";
import {
  IconDeviceGamepad,
  IconPlayerPlay,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cancelGame, createGameSession, endGame, startGame } from "../actions";

interface GameResult {
  id: string;
  userId: string;
  gameSessionId: string;
  score: number;
  won: boolean;
  position: number | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    displayUsername: string | null;
    username: string | null;
  };
}

interface GameAreaProps {
  room: {
    id: string;
    name: string;
    code: string;
    isOwner: boolean;
    memberCount: number;
    currentUserId?: string;
    currentUserName?: string;
    currentUserDisplayUsername?: string;
    members?: Array<{
      userId: string;
      isOnline?: boolean;
      user: {
        name: string;
        displayUsername: string | null;
      };
    }>;
    currentGame: {
      id: string;
      status: string;
      game: {
        id: string;
        name: string;
        description: string;
        minPlayers: number;
        maxPlayers: number;
        category: string;
      };
      results: GameResult[];
      startedAt: Date | null;
    } | null;
  };
  availableGames: Array<{
    id: string;
    name: string;
    description: string;
    minPlayers: number;
    maxPlayers: number;
    category: string;
  }>;
}

// Register all games on module load
registerAllGames();

export function GameArea({ room, availableGames }: GameAreaProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { invalidateRoom } = useInvalidateRooms();
  const { data: roomData, refetch: refetchRoomDetails } = useRoomDetails(
    room.id
  );

  const { onlineUsers, isConnected: isPresenceConnected } = useRoomPresence({
    roomId: room.id,
    userId: room.currentUserId || "",
    userName: room.currentUserName || "",
    displayUsername: room.currentUserDisplayUsername || "",
  });

  console.log("[GameArea] Component render", {
    roomId: room.id,
    currentUserId: room.currentUserId,
    isPresenceConnected,
    onlineUsersCount: onlineUsers.length,
    onlineUsers: onlineUsers.map((u) => ({
      userId: u.userId,
      userName: u.userName,
    })),
  });

  const initialGame: GameSessionData | null = room.currentGame
    ? {
        id: room.currentGame.id,
        status: room.currentGame.status as "waiting" | "playing" | "completed",
        game: room.currentGame.game,
        results: room.currentGame.results.map((r) => ({
          ...r,
          createdAt:
            r.createdAt instanceof Date
              ? r.createdAt.toISOString()
              : r.createdAt,
        })),
        startedAt:
          room.currentGame.startedAt instanceof Date
            ? room.currentGame.startedAt.toISOString()
            : room.currentGame.startedAt,
      }
    : null;

  const {
    currentGame,
    broadcastGameCreated,
    broadcastGameStarted,
    broadcastGameEnded,
    broadcastGameCancelled,
  } = useRealtimeGame({
    roomId: room.id,
    initialGame,
  });

  // Handles broadcasting updates when the room data is refetched after actions
  const prevRoomGameRef = useRef<{ id: string; status: string } | null>(
    room.currentGame
      ? { id: room.currentGame.id, status: room.currentGame.status }
      : null
  );

  useEffect(() => {
    const roomGame = roomData?.currentGame;
    const prevGame = prevRoomGameRef.current;

    if (roomGame) {
      const updatedGame: GameSessionData = {
        id: roomGame.id,
        status: roomGame.status as "waiting" | "playing" | "completed",
        game: roomGame.game,
        results: roomGame.results.map((r: GameResult) => ({
          ...r,
          createdAt:
            r.createdAt instanceof Date
              ? r.createdAt.toISOString()
              : r.createdAt,
        })),
        startedAt:
          roomGame.startedAt instanceof Date
            ? roomGame.startedAt.toISOString()
            : roomGame.startedAt,
      };

      if (!prevGame || prevGame.id !== updatedGame.id) {
        broadcastGameCreated(updatedGame);
        prevRoomGameRef.current = {
          id: updatedGame.id,
          status: updatedGame.status,
        };
      } else if (
        prevGame.id === updatedGame.id &&
        prevGame.status !== updatedGame.status
      ) {
        if (updatedGame.status === "playing" && prevGame.status === "waiting") {
          broadcastGameStarted(updatedGame);
        } else if (
          updatedGame.status === "completed" &&
          prevGame.status === "playing"
        ) {
          broadcastGameEnded(updatedGame);
        }
        prevRoomGameRef.current = {
          id: updatedGame.id,
          status: updatedGame.status,
        };
      }
    } else if (!roomGame && prevGame) {
      broadcastGameCancelled(prevGame.id);
      prevRoomGameRef.current = null;
    }
  }, [
    roomData?.currentGame,
    broadcastGameCreated,
    broadcastGameStarted,
    broadcastGameEnded,
    broadcastGameCancelled,
  ]);

  const displayGame = currentGame || room.currentGame;

  const members = Array.isArray(room.members) ? room.members : [];
  const currentUserId = room.currentUserId || "";
  const ownerId =
    "owner" in room &&
    room.owner &&
    typeof room.owner === "object" &&
    "id" in room.owner
      ? (room.owner as { id: string }).id
      : "";
  let onlineMemberCount = 0;

  // Use presence data if we have any users (even if not fully connected yet)
  // This handles the case where presence is syncing but not yet marked as connected
  if (onlineUsers.length > 0) {
    // When we have presence data, trust the presence count directly
    // Presence tracks all users in the room (including owner who might not be in members)
    onlineMemberCount = onlineUsers.length;

    console.log("[GameArea] Presence-based count", {
      isPresenceConnected,
      onlineUsersCount: onlineUsers.length,
      onlineUsers: onlineUsers.map((u) => ({
        userId: u.userId,
        userName: u.userName,
      })),
      onlineMemberCount,
      membersCount: members.length,
      currentUserId,
      ownerId,
    });
  } else {
    // Fallback to database isOnline status when presence is not connected
    const ownerInMembers = members.some((m) => m.userId === ownerId);
    onlineMemberCount = members.filter((member) => {
      return (
        member.userId === currentUserId ||
        member.userId === ownerId ||
        member.isOnline
      );
    }).length;

    // If owner is not in members list, add 1 to count
    if (!ownerInMembers && ownerId) {
      onlineMemberCount += 1;
    }

    // Ensure at least 1 (current user) is always counted
    if (onlineMemberCount === 0 && members.length > 0) {
      onlineMemberCount = 1;
    }
  }

  const handleCreateGame = async (gameId: string) => {
    setIsLoading(true);
    try {
      const result = await createGameSession(room.id, gameId);
      if (!result.success) {
        toast.error(result.error || "Failed to create game session");
        return;
      }

      // Invalidate and refetch room data - the useEffect will handle broadcasting
      await invalidateRoom(room.id);
      await refetchRoomDetails();

      toast.success(GAME_MESSAGES.SESSION_CREATED);
    } catch (error) {
      console.error("Error creating game session:", error);
      toast.error("Failed to create game session");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartGame = async () => {
    if (!displayGame) return;

    setIsLoading(true);
    try {
      const result = await startGame(room.id, displayGame.id);
      if (!result.success) {
        toast.error(result.error || "Failed to start game");
        return;
      }

      const { supabase } = await import("@/lib/supabase/client");
      const gameChannel = supabase.channel(`game:${displayGame.id}`);

      await new Promise<void>((resolve) => {
        gameChannel.subscribe((status) => {
          if (status === "SUBSCRIBED") {
            resolve();
          }
        });
      });

      await gameChannel.send({
        type: "broadcast",
        event: GAME_EVENTS.GAME_START,
        payload: { gameSessionId: displayGame.id },
      });

      setTimeout(() => {
        gameChannel.unsubscribe();
      }, 100);

      await invalidateRoom(room.id);
      await refetchRoomDetails();

      toast.success(GAME_MESSAGES.GAME_STARTED);
    } catch (error) {
      console.error("Error starting game:", error);
      toast.error("Failed to start game");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndGame = async (
    results: Array<{
      userId: string;
      score: number;
      won: boolean;
      position?: number;
    }>
  ) => {
    if (!displayGame) return;

    setIsLoading(true);
    try {
      const result = await endGame(room.id, displayGame.id, results);
      if (!result.success) {
        toast.error(result.error || "Failed to end game");
        return;
      }

      // Invalidate and refetch room data - the useEffect will handle broadcasting
      await invalidateRoom(room.id);
      await refetchRoomDetails();

      toast.success(GAME_MESSAGES.GAME_COMPLETED);
    } catch (error) {
      console.error("Error ending game:", error);
      toast.error("Failed to end game");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelGame = async () => {
    if (!displayGame) return;

    setIsLoading(true);
    try {
      const result = await cancelGame(room.id, displayGame.id);
      if (!result.success) {
        toast.error(result.error || "Failed to cancel game");
        return;
      }

      broadcastGameCancelled(displayGame.id);
      await invalidateRoom(room.id);

      toast.success(GAME_MESSAGES.GAME_CANCELLED);
    } catch (error) {
      console.error("Error canceling game:", error);
      toast.error("Failed to cancel game");
    } finally {
      setIsLoading(false);
    }
  };

  if (displayGame) {
    // Try to find registered game component
    const registeredGame = gameRegistry.matchGame(displayGame.game);
    const GameComponent = registeredGame?.component;

    // Debug logging to help troubleshoot game matching
    if (process.env.NODE_ENV === "development") {
      console.log("[GameArea] Game matching:", {
        dbGameId: displayGame.game.id,
        dbGameName: displayGame.game.name,
        registeredGameId: registeredGame?.id,
        registeredGameName: registeredGame?.name,
        hasComponent: !!GameComponent,
        allRegisteredGames: gameRegistry.getAll().map((g) => ({
          id: g.id,
          name: g.name,
        })),
      });
    }

    // If game is playing/completed and we have a component, render it
    if (
      (displayGame.status === GAME_SESSION_STATUS.PLAYING ||
        displayGame.status === GAME_SESSION_STATUS.COMPLETED) &&
      GameComponent
    ) {
      const members = Array.isArray(room.members) ? room.members : [];

      return (
        <div className="flex flex-col h-full gap-4">
          <GameComponent
            members={members.map((m) => ({
              userId: m.userId,
              user: {
                name: m.user.name,
                displayUsername: m.user.displayUsername || m.user.name,
              },
            }))}
            currentUserId={room.currentUserId || ""}
            gameSessionId={displayGame.id}
            roomId={room.id}
            gameStatus={
              displayGame.status as "waiting" | "playing" | "completed"
            }
            onGameEnd={room.isOwner ? handleEndGame : undefined}
            isOwner={room.isOwner}
            onCancelGame={room.isOwner ? handleCancelGame : undefined}
          />
        </div>
      );
    }

    return (
      <Card className="h-full rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <IconDeviceGamepad className="w-6 h-6 text-primary" />
            {displayGame.game.name}
            <Badge
              variant={
                displayGame.status === "playing" ? "default" : "secondary"
              }
              className="capitalize rounded-full"
            >
              {displayGame.status}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6">
          {displayGame.status === "waiting" ? (
            <>
              <div className="p-4 sm:p-6 md:p-8 bg-[linear-gradient(135deg,var(--primary)/10,var(--accent)/10)] rounded-xl sm:rounded-2xl text-center border border-foreground/10">
                <IconPlayerPlay className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-primary mb-4 sm:mb-6" />
                <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">
                  {room.isOwner
                    ? "Ready to Start"
                    : "Waiting for Game to Start"}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground/80 mb-4 sm:mb-6">
                  {displayGame.game.description}
                </p>
                <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm flex-wrap">
                  <div className="flex items-center gap-2">
                    <IconUsers className="w-5 h-5 text-primary" />
                    <span className="font-semibold">
                      {onlineMemberCount} online player
                      {onlineMemberCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="capitalize rounded-full border-foreground/20"
                  >
                    {displayGame.game.category}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {room.isOwner && (
                  <>
                    <Button
                      variant="modern"
                      size="modern-sm"
                      className="w-full sm:w-auto sm:px-8"
                      onClick={handleStartGame}
                      disabled={isLoading || onlineMemberCount < 2}
                    >
                      {isLoading ? "Starting..." : "Start Game"}
                    </Button>
                    {onlineMemberCount < 2 && (
                      <p className="text-xs text-muted-foreground text-center sm:text-left">
                        Need at least 2 online players to start (
                        {onlineMemberCount} online)
                      </p>
                    )}
                    <Button
                      variant="outline"
                      size="modern-sm"
                      className="w-full sm:w-auto sm:px-8"
                      onClick={handleCancelGame}
                      disabled={isLoading}
                    >
                      <IconX className="w-4 h-4 mr-2" />
                      Cancel Game
                    </Button>
                  </>
                )}
                {!room.isOwner && (
                  <p className="text-xs sm:text-sm text-muted-foreground/80 text-center py-4">
                    Waiting for room owner to start the game
                    <span className="inline-block ml-1">
                      <span
                        style={{
                          animation: "dot1 1.4s ease-in-out infinite",
                        }}
                      >
                        .
                      </span>
                      <span
                        style={{
                          animation: "dot2 1.4s ease-in-out infinite",
                        }}
                      >
                        .
                      </span>
                      <span
                        style={{
                          animation: "dot3 1.4s ease-in-out infinite",
                        }}
                      >
                        .
                      </span>
                    </span>
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="p-4 sm:p-6 md:p-8 bg-[linear-gradient(135deg,var(--primary)/10,var(--accent)/10)] rounded-xl sm:rounded-2xl text-center border border-foreground/10">
                <IconPlayerPlay className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-primary mb-4 sm:mb-6" />
                <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">
                  Game in Progress
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground/80 mb-4 sm:mb-6">
                  {displayGame.game.description}
                </p>
                <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm flex-wrap">
                  <div className="flex items-center gap-2">
                    <IconUsers className="w-5 h-5 text-primary" />
                    <span className="font-semibold">
                      {Array.isArray(displayGame.results)
                        ? displayGame.results.length
                        : 0}{" "}
                      playing
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="capitalize rounded-full border-foreground/20"
                  >
                    {displayGame.game.category}
                  </Badge>
                </div>
              </div>

              {displayGame.status === "playing" && room.isOwner && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    size="modern-sm"
                    className="w-full sm:w-auto sm:px-8"
                    onClick={handleCancelGame}
                    disabled={isLoading}
                  >
                    <IconX className="w-4 h-4 mr-2" />
                    End Game
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <IconDeviceGamepad className="w-6 h-6 text-primary" />
          Choose a Game
        </CardTitle>
      </CardHeader>

      <CardContent>
        {onlineMemberCount < 2 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 text-center px-4">
            <IconUsers className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/60 mb-4 sm:mb-6" />
            <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">
              {room.isOwner ? "Waiting for Players" : "Waiting for Game"}
            </h3>
            <p className="text-muted-foreground/80 text-xs sm:text-sm max-w-md">
              {room.isOwner ? (
                <>
                  You need at least 2 online players to start a game (
                  {onlineMemberCount} online). Invite friends with room code:{" "}
                  <strong className="font-mono text-primary break-all">
                    {room.code}
                  </strong>
                </>
              ) : (
                <>
                  Waiting for more players to join ({onlineMemberCount} online).
                  Room code:{" "}
                  <strong className="font-mono text-primary break-all">
                    {room.code}
                  </strong>
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <p className="text-xs sm:text-sm text-muted-foreground/80 font-medium">
              Select a game to play with your party:
            </p>

            <div className="grid gap-4">
              {(Array.isArray(availableGames) ? availableGames : [])
                .filter(
                  (game) =>
                    game.minPlayers <= room.memberCount &&
                    game.maxPlayers >= room.memberCount
                )
                .map((game) => (
                  <div
                    key={game.id}
                    className="p-4 border border-foreground/10 rounded-2xl bg-background/30 backdrop-blur-sm hover:bg-background/50 hover:border-foreground/20 cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm sm:text-base mb-1">
                          {game.name}
                        </h4>
                        <p className="text-xs text-muted-foreground/80 line-clamp-2">
                          {game.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 sm:gap-2 shrink-0">
                        <Badge
                          variant="outline"
                          className="text-[10px] sm:text-xs capitalize rounded-full border-foreground/20"
                        >
                          {game.category}
                        </Badge>
                        <span className="text-[10px] sm:text-xs text-muted-foreground/60 font-medium whitespace-nowrap">
                          {game.minPlayers}-{game.maxPlayers} players
                        </span>
                      </div>
                    </div>

                    {room.isOwner && (
                      <Button
                        variant="modern"
                        size="modern-sm"
                        className="w-full mt-2"
                        onClick={() => handleCreateGame(game.id)}
                        disabled={isLoading}
                      >
                        Start {game.name}
                      </Button>
                    )}
                  </div>
                ))}
            </div>

            {!room.isOwner && (
              <p className="text-xs text-muted-foreground/60 text-center py-6 font-medium">
                Waiting for room owner to start a game
                <span className="inline-block ml-1">
                  <span
                    style={{
                      animation: "dot1 1.4s ease-in-out infinite",
                    }}
                  >
                    .
                  </span>
                  <span
                    style={{
                      animation: "dot2 1.4s ease-in-out infinite",
                    }}
                  >
                    .
                  </span>
                  <span
                    style={{
                      animation: "dot3 1.4s ease-in-out infinite",
                    }}
                  >
                    .
                  </span>
                </span>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
