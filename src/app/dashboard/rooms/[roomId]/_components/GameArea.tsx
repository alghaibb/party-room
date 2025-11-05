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
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <IconDeviceGamepad className="w-5 h-5 text-primary" />
            {room.currentGame.game.name}
            <Badge
              variant={
                room.currentGame.status === "playing" ? "default" : "secondary"
              }
              className="capitalize"
            >
              {room.currentGame.status}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-6 bg-primary/5 rounded-lg text-center">
            <IconPlayerPlay className="w-12 h-12 mx-auto text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Game in Progress</h3>
            <p className="text-muted-foreground mb-4">
              {room.currentGame.game.description}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <IconUsers className="w-4 h-4" />
                <span>{room.currentGame.results.length} playing</span>
              </div>
              <Badge variant="outline" className="capitalize">
                {room.currentGame.game.category}
              </Badge>
            </div>
          </div>

          {room.currentGame.status === "waiting" && room.isOwner && (
            <Button className="w-full">Start Game</Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // No active game - show game selection
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <IconDeviceGamepad className="w-5 h-5" />
          Choose a Game
        </CardTitle>
      </CardHeader>

      <CardContent>
        {room.memberCount < 2 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <IconUsers className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Waiting for Players</h3>
            <p className="text-muted-foreground text-sm">
              You need at least 2 players to start a game. Invite friends with
              room code: <strong>{room.code}</strong>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select a game to play with your party:
            </p>

            <div className="grid gap-3">
              {availableGames
                .filter(
                  (game) =>
                    game.minPlayers <= room.memberCount &&
                    game.maxPlayers >= room.memberCount
                )
                .map((game) => (
                  <div
                    key={game.id}
                    className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{game.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {game.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {game.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {game.minPlayers}-{game.maxPlayers} players
                        </span>
                      </div>
                    </div>

                    {room.isOwner && (
                      <Button size="sm" className="mt-3 w-full">
                        Start {game.name}
                      </Button>
                    )}
                  </div>
                ))}
            </div>

            {!room.isOwner && (
              <p className="text-xs text-muted-foreground text-center py-4">
                Waiting for room owner to start a game...
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
