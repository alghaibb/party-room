"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconDeviceGamepad } from "@tabler/icons-react";
import type { GameComponentProps } from "@/lib/games";

interface PlaceholderGameProps extends GameComponentProps {
  gameName: string;
  gameDescription: string;
}

export function PlaceholderGame({
  gameName,
  gameDescription,
  gameStatus,
  isOwner,
  onCancelGame,
}: PlaceholderGameProps) {
  return (
    <Card className="h-full rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconDeviceGamepad className="w-6 h-6 text-primary" />
          {gameName}
          <Badge variant="secondary" className="capitalize rounded-full">
            {gameStatus}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-6 text-center">
        <div className="space-y-4">
          <div className="text-6xl">🚧</div>
          <h2 className="text-2xl font-bold">Coming Soon</h2>
          <p className="text-muted-foreground max-w-md">
            {gameDescription}
          </p>
          <p className="text-sm text-muted-foreground">
            This game is currently under development. Check back soon!
          </p>
        </div>
        {isOwner && onCancelGame && gameStatus === "waiting" && (
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-2">
              You can cancel this game session and choose a different game.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}




