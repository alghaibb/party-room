import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { JoinRoomTrigger } from "../../_components/JoinRoomTrigger";
import { RoomManagementDropdown } from "./RoomManagementDropdown";
import { IconUsers, IconCrown, IconDeviceGamepad } from "@tabler/icons-react";
import { Room } from "@/types/room";
import { Button } from "@/components/ui/button";

interface RoomCardProps {
  room: Room;
  isVerified?: boolean;
  currentUserId?: string;
}

export function RoomCard({
  room,
  isVerified = true,
  currentUserId,
}: RoomCardProps) {
  const isFull = room.currentPlayers >= room.maxPlayers;
  const playerPercentage = (room.currentPlayers / room.maxPlayers) * 100;
  const isOwner = currentUserId === room.owner.id;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold text-base leading-none">
              {room.name}
            </h3>
            {room.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {room.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {room.code}
            </Badge>
            <RoomManagementDropdown
              roomId={room.id}
              roomName={room.name}
              roomCode={room.code}
              isOwner={isOwner}
              ownerName={room.owner.name}
            />
          </div>
        </div>

        {/* Owner Info */}
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={room.owner.image || ""} />
            <AvatarFallback className="text-xs">
              {room.owner.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1">
            <IconCrown className="w-3 h-3 text-yellow-600" />
            <span className="text-xs text-muted-foreground">
              {room.owner.name}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Current Game */}
        {room.currentGame && (
          <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-md">
            <IconDeviceGamepad className="w-4 h-4 text-primary" />
            <div>
              <p className="text-sm font-medium">{room.currentGame.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {room.currentGame.category}
              </p>
            </div>
          </div>
        )}

        {/* Player Count */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <IconUsers className="w-4 h-4" />
              <span>Players</span>
            </div>
            <span className="font-medium">
              {room.currentPlayers}/{room.maxPlayers}
            </span>
          </div>

          {/* Player Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                playerPercentage >= 100
                  ? "bg-destructive"
                  : playerPercentage >= 75
                    ? "bg-yellow-500"
                    : "bg-green-500"
              }`}
              style={{ width: `${Math.min(playerPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Online Members Preview */}
        {room.members.length > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex -space-x-2">
              {room.members.slice(0, 3).map((member, index) => (
                <Avatar
                  key={index}
                  className="w-6 h-6 border-2 border-background"
                >
                  <AvatarImage src={member.image || ""} />
                  <AvatarFallback className="text-xs">
                    {member.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            {room.members.length > 3 && (
              <span className="text-xs text-muted-foreground ml-2">
                +{room.members.length - 3} more
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        {isFull ? (
          <Button disabled className="w-full" variant="outline">
            Room Full
          </Button>
        ) : !isVerified ? (
          <Button
            disabled
            className="w-full"
            variant="outline"
            title="Please verify your email to join rooms"
          >
            Verify Email to Join
          </Button>
        ) : (
          <JoinRoomTrigger
            isVerified={isVerified}
            variant={!room.currentGame ? "default" : "outline"}
            className="w-full"
          />
        )}
      </CardFooter>
    </Card>
  );
}
