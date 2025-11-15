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
    <Card className="rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[linear-gradient(135deg,var(--primary)/20,var(--accent)/20)] rounded-2xl flex items-center justify-center border border-foreground/10">
              <IconHome className="w-7 h-7 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black">{room.name}</CardTitle>
              {room.description && (
                <p className="text-sm text-muted-foreground/80 mt-2">
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
                ownerName={room.owner.name}
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
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="text-sm font-mono cursor-pointer hover:bg-accent/50 rounded-full border-foreground/20 px-3 py-1"
            onClick={handleCopyRoomCode}
          >
            <IconCopy className="w-3 h-3 mr-1" />
            {room.code}
          </Badge>
          <span className="text-xs text-muted-foreground/60">
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
