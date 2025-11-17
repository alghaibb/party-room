"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RoomManagementDropdown } from "../../_components/RoomManagementDropdown";
import { LeaveRoomButton } from "./LeaveRoomButton";
import { ShareRoomDialog } from "../../_components/ShareRoomDialog";
import {
  IconHome,
  IconUsers,
  IconCrown,
  IconGlobe,
  IconLock,
  IconCopy,
  IconShare,
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
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(room.code);
    toast.success(`Room code ${room.code} copied!`);
  };

  return (
    <Card className="rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[linear-gradient(135deg,var(--primary)/20,var(--accent)/20)] rounded-xl sm:rounded-2xl flex items-center justify-center border border-foreground/10 shrink-0">
              <IconHome className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-black truncate">{room.name}</CardTitle>
              {room.description && (
                <p className="text-xs sm:text-sm text-muted-foreground/80 mt-1 sm:mt-2 line-clamp-2">
                  {room.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShareDialogOpen(true)}
              className="h-7 w-7 sm:h-8 sm:w-8"
            >
              <IconShare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
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

      <CardContent className="space-y-3 sm:space-y-4">
        {/* Room Info */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm flex-wrap">
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
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Badge
            variant="outline"
            className="text-xs sm:text-sm font-mono cursor-pointer hover:bg-accent/50 rounded-full border-foreground/20 px-2 sm:px-3 py-1"
            onClick={handleCopyRoomCode}
          >
            <IconCopy className="w-3 h-3 mr-1" />
            {room.code}
          </Badge>
          <span className="text-xs text-muted-foreground/60 hidden sm:inline">
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

      <ShareRoomDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        roomCode={room.code}
        roomName={room.name}
      />
    </Card>
  );
}
