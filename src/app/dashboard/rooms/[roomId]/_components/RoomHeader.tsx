"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RoomManagementDropdown } from "../../_components/RoomManagementDropdown";
import { LeaveRoomButton } from "./LeaveRoomButton";
import {
  IconHome,
  IconUsers,
  IconCrown,
  IconGlobe,
  IconLock,
  IconCopy,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface RoomHeaderProps {
  room: {
    id: string;
    name: string;
    description: string | null;
    code: string;
    maxPlayers: number;
    isPublic: boolean;
    memberCount: number;
    owner: {
      id: string;
      name: string;
      username: string | null;
      image: string | null;
    };
    isOwner: boolean;
    currentUserId: string;
  };
}

export function RoomHeader({ room }: RoomHeaderProps) {
  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(room.code);
    toast.success(`Room code ${room.code} copied!`);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <IconHome className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{room.name}</CardTitle>
              {room.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {room.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {room.isOwner ? (
              <RoomManagementDropdown
                roomId={room.id}
                roomName={room.name}
                roomCode={room.code}
                isOwner={room.isOwner}
              />
            ) : (
              <LeaveRoomButton roomId={room.id} roomName={room.name} />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Room Info */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <IconUsers className="w-4 h-4 text-muted-foreground" />
            <span>
              {room.memberCount}/{room.maxPlayers} players
            </span>
          </div>

          <div className="flex items-center gap-1">
            {room.isPublic ? (
              <>
                <IconGlobe className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Public</span>
              </>
            ) : (
              <>
                <IconLock className="w-4 h-4 text-amber-600" />
                <span className="text-amber-600">Private</span>
              </>
            )}
          </div>
        </div>

        {/* Room Code */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-sm font-mono cursor-pointer hover:bg-accent"
            onClick={handleCopyRoomCode}
          >
            <IconCopy className="w-3 h-3 mr-1" />
            {room.code}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Click to copy room code
          </span>
        </div>

        {/* Owner Info */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Avatar className="w-6 h-6">
            <AvatarImage src={room.owner.image || ""} />
            <AvatarFallback className="text-xs">
              {room.owner.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1">
            <IconCrown className="w-3 h-3 text-yellow-600" />
            <span className="text-sm text-muted-foreground">
              Room created by <strong>{room.owner.name}</strong>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
