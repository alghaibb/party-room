"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconUsers,
  IconCrown,
  IconGlobe,
  IconLock,
  IconSparkles,
  IconArrowRight,
  IconAlertCircle,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRoomActions } from "@/hooks/use-room-actions";
import { useState } from "react";

interface JoinRoomPageContentProps {
  isValid: boolean;
  roomCode: string;
  error?: string;
  roomName?: string;
  roomDescription?: string | null;
  currentPlayers?: number;
  maxPlayers?: number;
  isPublic?: boolean;
  owner?: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
  };
  isAuthenticated: boolean;
  isVerified?: boolean;
  isFull?: boolean;
}

export function JoinRoomPageContent({
  isValid,
  roomCode,
  error,
  roomName,
  roomDescription,
  currentPlayers,
  maxPlayers,
  isPublic,
  owner,
  isAuthenticated,
  isVerified = false,
  isFull = false,
}: JoinRoomPageContentProps) {
  const { handleJoinRoom, isLoading } = useRoomActions();
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    await handleJoinRoom(roomCode);
    setIsJoining(false);
  };

  if (!isValid || error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <IconAlertCircle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl font-black">Room Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              {error || "The room you're looking for doesn't exist or has been removed."}
            </p>
            <div className="space-y-2">
              <Button asChild variant="modern" className="w-full" size="modern-md">
                <Link href="/dashboard/rooms">Browse Rooms</Link>
              </Button>
              {!isAuthenticated && (
                <Button asChild variant="modern-outline" className="w-full" size="modern-md">
                  <Link href="/">Go Home</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-lg rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-[linear-gradient(135deg,var(--primary),var(--accent))] rounded-2xl flex items-center justify-center shadow-lg">
                <IconSparkles className="w-8 h-8 text-primary-foreground" strokeWidth={2} />
              </div>
              <div className="absolute -inset-1 bg-[linear-gradient(135deg,var(--primary),var(--accent))] rounded-2xl blur opacity-30" />
            </div>
          </div>
          <CardTitle className="text-2xl font-black">{roomName || "Join Room"}</CardTitle>
          {roomDescription && (
            <p className="text-sm text-muted-foreground/80 mt-2">{roomDescription}</p>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Room Code */}
          <div className="text-center">
            <Badge
              variant="outline"
              className="text-lg font-mono px-4 py-2 rounded-full border-foreground/20"
            >
              {roomCode}
            </Badge>
          </div>

          {/* Room Info */}
          <div className="space-y-3">
            {currentPlayers !== undefined && maxPlayers !== undefined && (
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <IconUsers className="w-5 h-5 text-primary" />
                  <span className="font-medium">Players</span>
                </div>
                <span className="font-bold">
                  {currentPlayers}/{maxPlayers}
                </span>
              </div>
            )}

            {isPublic !== undefined && (
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl">
                <div className="flex items-center gap-2">
                  {isPublic ? (
                    <>
                      <IconGlobe className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Public Room</span>
                    </>
                  ) : (
                    <>
                      <IconLock className="w-5 h-5 text-amber-600" />
                      <span className="font-medium">Private Room</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {owner && (
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={owner.image || ""} />
                    <AvatarFallback className="text-xs">
                      {owner.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <IconCrown className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium">{owner.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">Owner</span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          {/* Join Actions */}
          <div className="space-y-3 pt-4">
            {!isAuthenticated ? (
              <>
                <Button asChild variant="modern" className="w-full" size="modern-md">
                  <Link href={`/sign-in?redirectTo=/join/${roomCode}`}>
                    Sign In to Join
                    <IconArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="modern-outline" className="w-full" size="modern-md">
                  <Link href="/sign-up">Create Account</Link>
                </Button>
              </>
            ) : !isVerified ? (
              <>
                <Button disabled variant="modern-outline" className="w-full" size="modern-md">
                  Verify Email to Join
                </Button>
                <Button asChild variant="modern-outline" className="w-full" size="modern-md">
                  <Link href="/verify-email">Verify Email</Link>
                </Button>
              </>
            ) : isFull ? (
              <Button disabled variant="modern-outline" className="w-full" size="modern-md">
                Room is Full
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleJoin}
                  disabled={isJoining || isLoading}
                  variant="modern"
                  className="w-full"
                  size="modern-md"
                >
                  {isJoining || isLoading ? "Joining..." : "Join Room"}
                  <IconArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button asChild variant="modern-outline" className="w-full" size="modern-md">
                  <Link href="/dashboard/rooms">Browse Other Rooms</Link>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

