"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { IconClock, IconTrophy, IconUsers, IconX } from "@tabler/icons-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { TRIVIA_GAME, GAME_EVENTS } from "@/constants/game";
import { getRandomQuestions, type TriviaQuestion } from "@/lib/games/questions";

interface TriviaGameProps {
  members: Array<{
    userId: string;
    user: { name: string; displayUsername: string | null };
  }>;
  currentUserId: string;
  gameSessionId: string;
  roomId: string;
  gameStatus: "waiting" | "playing" | "completed";
  onGameEnd?: (
    results: Array<{
      userId: string;
      score: number;
      won: boolean;
      position?: number;
    }>
  ) => void;
  isOwner?: boolean;
  onCancelGame?: () => void;
}

const QUESTIONS_PER_GAME = TRIVIA_GAME.QUESTIONS_PER_GAME;
const TOTAL_GAME_TIME = TRIVIA_GAME.TOTAL_GAME_TIME_SECONDS;

export function TriviaGame({
  members,
  currentUserId,
  gameSessionId,
  gameStatus,
  onGameEnd,
  isOwner = false,
  onCancelGame,
}: TriviaGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_GAME_TIME);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [finalResults, setFinalResults] = useState<Array<{
    userId: string;
    score: number;
    won: boolean;
    position?: number;
  }> | null>(null);
  const [finishedPlayers, setFinishedPlayers] = useState<Set<string>>(
    new Set()
  );
  const [waitingMessageIndex, setWaitingMessageIndex] = useState(0);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const hasStartedRef = useRef(false);
  const hasCalledOnGameEndRef = useRef(false);

  const waitingMessages = TRIVIA_GAME.WAITING_MESSAGES;

  // Get random questions using the question service
  // This ensures different questions each game while keeping them synchronized across players
  const [questions] = useState<TriviaQuestion[]>(() => {
    return getRandomQuestions(gameSessionId, QUESTIONS_PER_GAME);
  });

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const gameChannel = supabase.channel(`game:${gameSessionId}`, {
      config: {
        broadcast: { self: true },
      },
    });

    channelRef.current = gameChannel;

    gameChannel
      .on("broadcast", { event: GAME_EVENTS.GAME_START }, () => {
        if (!hasStartedRef.current) {
          hasStartedRef.current = true;
          setTimeout(() => {
            setGameStarted(true);
          }, 0);
        }
      })
      .on("broadcast", { event: GAME_EVENTS.SCORE_UPDATE }, ({ payload }) => {
        const { userId, score } = payload as { userId: string; score: number };
        if (userId !== currentUserId) {
          setScores((prev) => ({
            ...prev,
            [userId]: score,
          }));
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
        // Mark all players as finished when game ends
        setFinishedPlayers(new Set(results.map((r) => r.userId)));
      })
      .on("broadcast", { event: GAME_EVENTS.PLAYER_FINISHED }, ({ payload }) => {
        const { userId } = payload as { userId: string };
        setFinishedPlayers((prev) => new Set([...prev, userId]));
      })
      .subscribe();

    return () => {
      gameChannel.unsubscribe();
    };
  }, [gameSessionId, currentUserId]);

  useEffect(() => {
    if (gameStatus === "playing" && !hasStartedRef.current) {
      hasStartedRef.current = true;

      // Use setTimeout to defer state update and avoid setState in effect warning
      setTimeout(() => {
        setGameStarted(true);
      }, 0);

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

    if (gameStatus === "completed" && !gameEnded) {
      if (Object.keys(scores).length > 0) {
        const sortedScores = Object.entries(scores)
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

        setTimeout(() => {
          setFinalResults(allResults);
          setGameEnded(true);
          setGameStarted(true);
        }, 0);
      }
    }

    // Reset hasCalledOnGameEndRef when game status changes back to waiting (new game)
    if (gameStatus === "waiting") {
      hasCalledOnGameEndRef.current = false;
      hasStartedRef.current = false;
      setTimeout(() => {
        setGameStarted(false);
        setGameEnded(false);
        setFinalResults(null);
        setScores({});
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setTimeLeft(TOTAL_GAME_TIME);
        setAnswered(false);
      }, 0);
    }
  }, [gameStatus, isOwner, gameSessionId, gameEnded, scores, members]);

  // Call onGameEnd when all players finish and we have final results (owner only)
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
    setScores((currentScores) => {
      // Broadcast that this player finished (don't end game yet)
      const channel = channelRef.current;
      if (channel) {
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

      return currentScores;
    });

    setGameEnded(true);
    setFinishedPlayers((prev) => new Set([...prev, currentUserId]));
  }, [currentUserId]);

  // When all players finish, calculate and broadcast final results (owner only)
  useEffect(() => {
    if (
      isOwner &&
      gameEnded &&
      finishedPlayers.size === members.length &&
      finishedPlayers.size > 0 &&
      !finalResults
    ) {
      setTimeout(() => {
        const sortedScores = Object.entries(scores)
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
      }, 0);
    }
  }, [
    isOwner,
    gameEnded,
    finishedPlayers.size,
    members.length,
    scores,
    finalResults,
    members,
  ]);

  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (!gameEnded) {
            endGame();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameEnded, endGame]);

  const handleAnswer = (answerIndex: number | null) => {
    if (answered) return;

    setAnswered(true);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    if (isCorrect) {
      const newScore = (scores[currentUserId] || 0) + 1;
      setScores((prev) => ({
        ...prev,
        [currentUserId]: newScore,
      }));

      // Broadcast score update to other players
      const channel = channelRef.current;
      if (channel) {
        channel
          .send({
            type: "broadcast",
            event: GAME_EVENTS.SCORE_UPDATE,
            payload: { userId: currentUserId, score: newScore },
          })
          .catch((error) => {
            console.error("Failed to broadcast score:", error);
          });
      }

      toast.success("Correct!");
    } else {
      toast.error(
        `Wrong! The correct answer was: ${currentQuestion.options[currentQuestion.correctAnswer]}`
      );
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setAnswered(false);
      } else {
        endGame();
      }
    }, TRIVIA_GAME.ANSWER_FEEDBACK_DELAY_MS);
  };

  // Rotate waiting messages when user finished but game not completed
  useEffect(() => {
    if (gameEnded && gameStatus === "playing") {
      const interval = setInterval(() => {
        setWaitingMessageIndex(
          (prev) => (prev + 1) % waitingMessages.length
        );
      }, TRIVIA_GAME.WAITING_MESSAGE_ROTATION_INTERVAL_MS);

      return () => clearInterval(interval);
    }
  }, [gameEnded, gameStatus, waitingMessages.length]);

  if (!gameStarted) {
    return (
      <Card className="h-full rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Trivia Challenge</h2>
            <p className="text-muted-foreground">
              {isOwner
                ? "Click 'Start Game' in the game area to begin!"
                : "Waiting for game to start..."}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <IconClock className="w-4 h-4" />
                <span>
                  {TOTAL_GAME_TIME}s total for {QUESTIONS_PER_GAME} questions
                </span>
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

  // Show waiting screen if user finished but game is still playing
  if (gameEnded && gameStatus === "playing" && !finalResults) {
    const remainingPlayers = members.filter(
      (m) => !finishedPlayers.has(m.userId)
    );
    const currentMessage = waitingMessages[waitingMessageIndex];

    return (
      <Card className="h-full rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
          <div className="space-y-4">
            <IconTrophy className="w-16 h-16 mx-auto text-primary animate-pulse" />
            <h2 className="text-2xl font-bold">You Finished!</h2>
            <p className="text-lg text-muted-foreground animate-[fade_2s_ease-in-out_infinite]">
              {currentMessage}
            </p>
            {remainingPlayers.length > 0 && (
              <div className="mt-4 p-4 bg-background/30 rounded-xl border border-foreground/10">
                <p className="text-sm text-muted-foreground">
                  {remainingPlayers.length} player
                  {remainingPlayers.length !== 1 ? "s" : ""} still playing
                </p>
              </div>
            )}
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
      .sort(
        (a, b) =>
          (a.position || members.length) - (b.position || members.length)
      );

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
                  <p className="text-lg font-bold">
                    {player.score}/{QUESTIONS_PER_GAME}
                  </p>
                  {player.won && player.score > 0 && (
                    <Badge variant="default" className="mt-1">
                      Winner!
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          {isOwner && (
            <div className="pt-4 border-t border-foreground/10 space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Game completed! You can start a new game when ready.
              </p>
              {onCancelGame && (
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
            </div>
          )}
          {!isOwner && (
            <div className="pt-4 border-t border-foreground/10">
              <p className="text-sm text-muted-foreground text-center">
                Waiting for room owner to start a new game...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Question {currentQuestionIndex + 1} of {questions.length}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{currentQuestion.category}</Badge>
            {isOwner && onCancelGame && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancelGame}
                className="h-8 w-8 p-0"
                title="End Game"
              >
                <IconX className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <Progress
          value={((currentQuestionIndex + 1) / questions.length) * 100}
          className="mt-2"
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Time remaining</p>
            <div className="flex items-center gap-2">
              <IconClock className="w-4 h-4" />
              <span className="font-mono font-bold">{timeLeft}s</span>
            </div>
          </div>

          <div className="p-6 bg-background/30 rounded-xl border border-foreground/10">
            <h3 className="text-xl font-bold mb-6">
              {currentQuestion.question}
            </h3>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "modern" : "outline"}
                  className="w-full justify-start h-auto py-4 text-left"
                  onClick={() => {
                    if (!answered) {
                      setSelectedAnswer(index);
                      handleAnswer(index);
                    }
                  }}
                  disabled={answered}
                >
                  <span className="font-semibold mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Your score: {scores[currentUserId] || 0} /{" "}
              {currentQuestionIndex + 1}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
