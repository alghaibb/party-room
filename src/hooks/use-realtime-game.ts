import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface GameSessionData {
  id: string;
  status: "waiting" | "playing" | "completed";
  game: {
    id: string;
    name: string;
    description: string;
    minPlayers: number;
    maxPlayers: number;
    category: string;
  };
  results: Array<{
    id: string;
    userId: string;
    gameSessionId: string;
    score: number;
    won: boolean;
    position: number | null;
    createdAt: Date | string;
    user: {
      id: string;
      name: string;
      displayUsername: string | null;
      username: string | null;
    };
  }>;
  startedAt: Date | string | null;
}

interface UseRealtimeGameProps {
  roomId: string;
  initialGame: GameSessionData | null;
  onGameUpdate?: (game: GameSessionData | null) => void;
}

export function useRealtimeGame({
  roomId,
  initialGame,
  onGameUpdate,
}: UseRealtimeGameProps) {
  const [realtimeGame, setRealtimeGame] = useState<GameSessionData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const lastBroadcastIdRef = useRef<string | null>(null);

  // Use realtime game if available, otherwise fall back to initialGame
  const currentGame = realtimeGame || initialGame;

  // Set up Supabase Realtime channel
  useEffect(() => {
    const roomChannel = supabase.channel(`room:${roomId}`, {
      config: {
        broadcast: { self: true }, // Receive our own broadcasts
      },
    });

    channelRef.current = roomChannel;

    roomChannel
      .on("broadcast", { event: "game-created" }, ({ payload }) => {
        const gameData = payload as GameSessionData;
        // Only update if this is a new broadcast (avoid processing our own broadcasts twice)
        if (lastBroadcastIdRef.current !== gameData.id) {
          setRealtimeGame(gameData);
          lastBroadcastIdRef.current = gameData.id;
          onGameUpdate?.(gameData);
        }
      })
      .on("broadcast", { event: "game-started" }, ({ payload }) => {
        const gameData = payload as GameSessionData;
        setRealtimeGame((prev) => {
          if (prev?.id === gameData.id) {
            return gameData;
          }
          // If no prev game or different game, use the new one
          return gameData;
        });
        onGameUpdate?.(gameData);
      })
      .on("broadcast", { event: "game-ended" }, ({ payload }) => {
        const gameData = payload as GameSessionData;
        setRealtimeGame((prev) => {
          if (prev?.id === gameData.id) {
            return gameData;
          }
          // If no prev game or different game, use the new one
          return gameData;
        });
        onGameUpdate?.(gameData);
      })
      .on("broadcast", { event: "game-cancelled" }, ({ payload }) => {
        const { gameSessionId } = payload as { gameSessionId: string };
        setRealtimeGame((prev) => {
          if (prev?.id === gameSessionId) {
            return null;
          }
          return prev;
        });
        onGameUpdate?.(null);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        } else if (status === "CLOSED") {
          setIsConnected(false);
        }
      });

    // Cleanup on unmount
    return () => {
      if (roomChannel) {
        roomChannel.unsubscribe();
      }
    };
  }, [roomId, onGameUpdate]);

  const broadcastGameCreated = useCallback(
    (gameData: GameSessionData) => {
      const channel = channelRef.current;
      if (!channel) return;

      channel.send({
        type: "broadcast",
        event: "game-created",
        payload: gameData,
      });
    },
    []
  );

  const broadcastGameStarted = useCallback(
    (gameData: GameSessionData) => {
      const channel = channelRef.current;
      if (!channel) return;

      channel.send({
        type: "broadcast",
        event: "game-started",
        payload: gameData,
      });
    },
    []
  );

  const broadcastGameEnded = useCallback(
    (gameData: GameSessionData) => {
      const channel = channelRef.current;
      if (!channel) return;

      channel.send({
        type: "broadcast",
        event: "game-ended",
        payload: gameData,
      });
    },
    []
  );

  const broadcastGameCancelled = useCallback(
    (gameSessionId: string) => {
      const channel = channelRef.current;
      if (!channel) return;

      channel.send({
        type: "broadcast",
        event: "game-cancelled",
        payload: { gameSessionId },
      });
    },
    []
  );

  return {
    currentGame,
    isConnected,
    broadcastGameCreated,
    broadcastGameStarted,
    broadcastGameEnded,
    broadcastGameCancelled,
  };
}

