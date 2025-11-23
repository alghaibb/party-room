"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GAME_EVENTS } from "@/constants/game";
import type { GameComponentProps } from "@/lib/games";
import { supabase } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { IconClock, IconTrophy, IconUsers, IconX } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const WORDS = [
  "ELEPHANT",
  "COMPUTER",
  "MOUNTAIN",
  "OCEAN",
  "LIBRARY",
  "BUTTERFLY",
  "TELESCOPE",
  "ADVENTURE",
  "CHOCOLATE",
  "SUNSHINE",
  "RAINBOW",
  "KEYBOARD",
  "JOURNEY",
  "DIAMOND",
  "VOLCANO",
  "GALAXY",
  "PYRAMID",
  "WIZARD",
  "DRAGON",
  "CASTLE",
];

const MAX_ATTEMPTS = 6;
const TIME_LIMIT_SECONDS = 60;

// Seeded random for synchronized word selection
function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return () => {
    hash = (hash << 5) - hash + hash;
    return (hash & 0x7fffffff) / 0x7fffffff;
  };
}

function getRandomWord(gameSessionId: string): string {
  const random = seededRandom(gameSessionId);
  const index = Math.floor(random() * WORDS.length);
  return WORDS[index];
}

export function WordGuessGame({
  members,
  currentUserId,
  gameSessionId,
  gameStatus,
  onGameEnd,
  isOwner = false,
  onCancelGame,
}: GameComponentProps) {
  const [word] = useState(() => getRandomWord(gameSessionId));
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [finalResults, setFinalResults] = useState<Array<{
    userId: string;
    score: number;
    won: boolean;
    position?: number;
  }> | null>(null);
  const [finishedPlayers, setFinishedPlayers] = useState<Set<string>>(
    new Set()
  );
  const channelRef = useRef<RealtimeChannel | null>(null);
  const hasStartedRef = useRef(false);
  const hasCalledOnGameEndRef = useRef(false);

  const displayWord = word
    .split("")
    .map((letter) => (guessedLetters.has(letter) ? letter : "_"))
    .join(" ");

  const isWordGuessed = word
    .split("")
    .every((letter) => guessedLetters.has(letter));
  const isGameOver = attempts >= MAX_ATTEMPTS || isWordGuessed || timeLeft <= 0;

  useEffect(() => {
    const gameChannel = supabase.channel(`game:${gameSessionId}`, {
      config: { broadcast: { self: true } },
    });

    channelRef.current = gameChannel;

    gameChannel
      .on("broadcast", { event: GAME_EVENTS.GAME_START }, () => {
        if (!hasStartedRef.current) {
          hasStartedRef.current = true;
          setTimeout(() => setGameStarted(true), 0);
        }
      })
      .on("broadcast", { event: GAME_EVENTS.SCORE_UPDATE }, ({ payload }) => {
        const { userId, score } = payload as { userId: string; score: number };
        if (userId !== currentUserId) {
          setScores((prev) => ({ ...prev, [userId]: score }));
        }
      })
      .on("broadcast", { event: GAME_EVENTS.GAME_END }, ({ payload }) => {
        const results = payload as Array<{
          userId: string;
          score: number;
          won: boolean;
          position?: number;
        }>;
        setFinalResults(results);
        setGameEnded(true);
        setFinishedPlayers(new Set(results.map((r) => r.userId)));
      })
      .on(
        "broadcast",
        { event: GAME_EVENTS.PLAYER_FINISHED },
        ({ payload }) => {
          const { userId } = payload as { userId: string };
          setFinishedPlayers((prev) => new Set([...prev, userId]));
        }
      )
      .subscribe();

    return () => {
      gameChannel.unsubscribe();
    };
  }, [gameSessionId, currentUserId]);

  useEffect(() => {
    if (gameStatus === "playing" && !hasStartedRef.current) {
      hasStartedRef.current = true;
      setTimeout(() => setGameStarted(true), 0);

      const channel = channelRef.current;
      if (channel && isOwner) {
        channel
          .send({
            type: "broadcast",
            event: GAME_EVENTS.GAME_START,
            payload: { gameSessionId },
          })
          .catch((error) => {
            console.error("Failed to broadcast game start:", error);
          });
      }
    }

    if (gameStatus === "waiting") {
      hasCalledOnGameEndRef.current = false;
      hasStartedRef.current = false;
      setTimeout(() => {
        setGameStarted(false);
        setGameEnded(false);
        setFinalResults(null);
        setScores({});
        setGuessedLetters(new Set());
        setAttempts(0);
        setTimeLeft(TIME_LIMIT_SECONDS);
      }, 0);
    }
  }, [gameStatus, isOwner, gameSessionId]);

  const endGameRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (
      isOwner &&
      gameEnded &&
      finalResults &&
      finishedPlayers.size === members.length &&
      onGameEnd &&
      !hasCalledOnGameEndRef.current
    ) {
      hasCalledOnGameEndRef.current = true;
      onGameEnd(finalResults);
    }
  }, [
    isOwner,
    gameEnded,
    finalResults,
    finishedPlayers.size,
    members.length,
    onGameEnd,
  ]);

  const endGame = useCallback(() => {
    const score = isWordGuessed ? MAX_ATTEMPTS - attempts + 1 : 0;

    setScores((currentScores) => {
      const newScores = {
        ...currentScores,
        [currentUserId]: score,
      };

      const channel = channelRef.current;
      if (channel) {
        channel
          .send({
            type: "broadcast",
            event: GAME_EVENTS.SCORE_UPDATE,
            payload: { userId: currentUserId, score },
          })
          .catch((error) => {
            console.error("Failed to broadcast score:", error);
          });

        channel
          .send({
            type: "broadcast",
            event: GAME_EVENTS.PLAYER_FINISHED,
            payload: { userId: currentUserId },
          })
          .catch((error) => {
            console.error("Failed to broadcast player finished:", error);
          });
      }

      return newScores;
    });

    setGameEnded(true);
    setFinishedPlayers((prev) => new Set([...prev, currentUserId]));

    if (isOwner) {
      setTimeout(() => {
        const allScores = { ...scores, [currentUserId]: score };
        const sortedScores = Object.entries(allScores)
          .map(([userId, score]) => ({
            userId,
            score,
            won: false,
            position: 0,
          }))
          .sort((a, b) => b.score - a.score);

        sortedScores.forEach((result, index) => {
          result.position = index + 1;
          if (index === 0 && result.score > 0) {
            result.won = true;
          }
        });

        const allResults = members.map((member) => {
          const existing = sortedScores.find((r) => r.userId === member.userId);
          return (
            existing || {
              userId: member.userId,
              score: 0,
              won: false,
              position: members.length,
            }
          );
        });

        setFinalResults(allResults);

        const channel = channelRef.current;
        if (channel) {
          channel
            .send({
              type: "broadcast",
              event: GAME_EVENTS.GAME_END,
              payload: allResults,
            })
            .catch((error) => {
              console.error("Failed to broadcast game end:", error);
            });
        }
      }, 1000);
    }
  }, [isWordGuessed, attempts, currentUserId, isOwner, scores, members]);

  useEffect(() => {
    endGameRef.current = endGame;
  }, [endGame]);

  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGameRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameEnded]);

  useEffect(() => {
    if (isGameOver && !gameEnded) {
      endGameRef.current?.();
    }
  }, [isGameOver, gameEnded]);

  const handleGuess = (letter: string) => {
    if (gameEnded || guessedLetters.has(letter)) return;

    const upperLetter = letter.toUpperCase();
    setGuessedLetters((prev) => new Set([...prev, upperLetter]));

    if (!word.includes(upperLetter)) {
      setAttempts((prev) => prev + 1);
      toast.error(`"${upperLetter}" is not in the word!`);
    } else {
      toast.success(`"${upperLetter}" is correct!`);
    }
  };

  if (!gameStarted) {
    return (
      <Card className="h-full rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Word Guess</h2>
            <p className="text-muted-foreground">
              {isOwner
                ? "Click 'Start Game' in the game area to begin!"
                : "Waiting for game to start..."}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <IconClock className="w-4 h-4" />
                <span>{TIME_LIMIT_SECONDS}s time limit</span>
              </div>
              <div className="flex items-center gap-2">
                <IconUsers className="w-4 h-4" />
                <span>{members.length} players</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gameEnded && finalResults) {
    const sortedScores = finalResults
      .map((result) => {
        const member = members.find((m) => m.userId === result.userId);
        return {
          userId: result.userId,
          score: result.score,
          position: result.position || members.length,
          won: result.won,
          name: member?.user.displayUsername || member?.user.name || "Unknown",
        };
      })
      .sort((a, b) => a.position - b.position);

    return (
      <Card className="h-full rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTrophy className="w-6 h-6 text-yellow-500" />
            Game Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {sortedScores.map((player) => (
              <div
                key={player.userId}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  player.won && player.score > 0
                    ? "bg-yellow-500/10 border-2 border-yellow-500/30"
                    : "bg-background/30 border border-foreground/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      player.won && player.score > 0
                        ? "bg-yellow-500 text-yellow-900"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {player.position}
                  </div>
                  <div>
                    <p className="font-semibold">{player.name}</p>
                    {player.userId === currentUserId && (
                      <p className="text-xs text-muted-foreground">You</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">Score: {player.score}</p>
                  {player.won && player.score > 0 && (
                    <Badge variant="default" className="mt-1">
                      Winner!
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          {isOwner && onCancelGame && (
            <Button
              variant="outline"
              size="modern-sm"
              className="w-full"
              onClick={onCancelGame}
            >
              <IconX className="w-4 h-4 mr-2" />
              Clear Game & Choose New Game
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Word Guess</CardTitle>
          <div className="flex items-center gap-2">
            <IconClock className="w-4 h-4" />
            <span className="font-mono font-bold">{timeLeft}s</span>
            {isOwner && onCancelGame && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancelGame}
                className="h-8 w-8 p-0"
              >
                <IconX className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="p-6 bg-background/30 rounded-xl border border-foreground/10">
            <p className="text-3xl font-bold tracking-wider mb-4">
              {displayWord}
            </p>
            <p className="text-sm text-muted-foreground">
              Attempts: {attempts} / {MAX_ATTEMPTS}
            </p>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 26 }, (_, i) => {
              const letter = String.fromCharCode(65 + i);
              const isGuessed = guessedLetters.has(letter);
              const isCorrect = word.includes(letter);

              return (
                <Button
                  key={letter}
                  variant={
                    isGuessed
                      ? isCorrect
                        ? "modern"
                        : "destructive"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handleGuess(letter)}
                  disabled={isGuessed || gameEnded}
                  className="h-10"
                >
                  {letter}
                </Button>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Your score: {scores[currentUserId] || 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
