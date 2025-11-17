import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconDeviceGamepad,
  IconPlayerPlay,
  IconUsers,
} from "@tabler/icons-react";

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

export function GameArea({ room, availableGames }: GameAreaProps) {
  if (room.currentGame) {
    // Game is currently active
    return (
      <Card className="h-full rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <IconDeviceGamepad className="w-6 h-6 text-primary" />
            {room.currentGame.game.name}
            <Badge
              variant={
                room.currentGame.status === "playing" ? "default" : "secondary"
              }
              className="capitalize rounded-full"
            >
              {room.currentGame.status}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6">
          <div className="p-4 sm:p-6 md:p-8 bg-[linear-gradient(135deg,var(--primary)/10,var(--accent)/10)] rounded-xl sm:rounded-2xl text-center border border-foreground/10">
            <IconPlayerPlay className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-primary mb-4 sm:mb-6" />
            <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">Game in Progress</h3>
            <p className="text-sm sm:text-base text-muted-foreground/80 mb-4 sm:mb-6">
              {room.currentGame.game.description}
            </p>
            <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <IconUsers className="w-5 h-5 text-primary" />
                <span className="font-semibold">
                  {Array.isArray(room.currentGame.results) ? room.currentGame.results.length : 0} playing
                </span>
              </div>
              <Badge variant="outline" className="capitalize rounded-full border-foreground/20">
                {room.currentGame.game.category}
              </Badge>
            </div>
          </div>

          {room.currentGame.status === "waiting" && room.isOwner && (
            <Button variant="modern" size="modern-sm" className="w-full sm:w-auto sm:px-8">Start Game</Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // No active game - show game selection
  return (
    <Card className="h-full rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <IconDeviceGamepad className="w-6 h-6 text-primary" />
          Choose a Game
        </CardTitle>
      </CardHeader>

      <CardContent>
        {room.memberCount < 2 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 text-center px-4">
            <IconUsers className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/60 mb-4 sm:mb-6" />
            <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">Waiting for Players</h3>
            <p className="text-muted-foreground/80 text-xs sm:text-sm max-w-md">
              You need at least 2 players to start a game. Invite friends with
              room code: <strong className="font-mono text-primary break-all">{room.code}</strong>
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
                        <h4 className="font-bold text-sm sm:text-base mb-1">{game.name}</h4>
                        <p className="text-xs text-muted-foreground/80 line-clamp-2">
                          {game.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 sm:gap-2 shrink-0">
                        <Badge variant="outline" className="text-[10px] sm:text-xs capitalize rounded-full border-foreground/20">
                          {game.category}
                        </Badge>
                        <span className="text-[10px] sm:text-xs text-muted-foreground/60 font-medium whitespace-nowrap">
                          {game.minPlayers}-{game.maxPlayers} players
                        </span>
                      </div>
                    </div>

                    {room.isOwner && (
                      <Button variant="modern" size="modern-sm" className="w-full mt-2">
                        Start {game.name}
                      </Button>
                    )}
                  </div>
                ))}
            </div>

            {!room.isOwner && (
              <p className="text-xs text-muted-foreground/60 text-center py-6 font-medium">
                Waiting for room owner to start a game...
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
