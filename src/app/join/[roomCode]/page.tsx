import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { roomCodeSchema } from "@/lib/validations/room/room.schema";
import { JoinRoomPageContent } from "./_components/JoinRoomPageContent";

export const dynamic = "force-dynamic";

interface JoinRoomPageProps {
  params: Promise<{ roomCode: string }>;
}

export async function generateMetadata({
  params,
}: JoinRoomPageProps): Promise<Metadata> {
  const { roomCode } = await params;

  return {
    title: `Join Room ${roomCode} | Party Room`,
    description: `Join the party room with code ${roomCode}`,
  };
}

export default async function JoinRoomPage({ params }: JoinRoomPageProps) {
  const { roomCode } = await params;
  const session = await getSession();

  // Validate room code format
  const validationResult = roomCodeSchema.safeParse(roomCode);
  if (!validationResult.success) {
    return (
      <JoinRoomPageContent
        isValid={false}
        error="Invalid room code format"
        roomCode={roomCode}
        isAuthenticated={!!session?.user}
      />
    );
  }

  const validatedRoomCode = validationResult.data;

  // Find the room
  const room = await prisma.partyRoom.findUnique({
    where: { code: validatedRoomCode },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      members: session?.user
        ? {
            where: {
              userId: session.user.id,
            },
            select: {
              userId: true,
            },
          }
        : false,
      _count: {
        select: { members: true },
      },
    },
  });

  if (!room) {
    return (
      <JoinRoomPageContent
        isValid={false}
        error="Room not found"
        roomCode={roomCode}
        isAuthenticated={!!session?.user}
      />
    );
  }

  if (!room.isActive) {
    return (
      <JoinRoomPageContent
        isValid={false}
        error="This room is no longer active"
        roomCode={roomCode}
        isAuthenticated={!!session?.user}
        roomName={room.name}
      />
    );
  }

  // If user is authenticated, verified, and already a member, redirect to room
  const userMembership = Array.isArray(room.members) ? room.members : [];
  if (session?.user?.emailVerified && userMembership.length > 0) {
    redirect(`/dashboard/rooms/${room.id}`);
  }

  // Show join page (not authenticated or not verified)
  return (
    <JoinRoomPageContent
      isValid={true}
      roomCode={roomCode}
      roomName={room.name}
      roomDescription={room.description}
      currentPlayers={room._count.members}
      maxPlayers={room.maxPlayers}
      isPublic={room.isPublic}
      owner={room.owner}
      isAuthenticated={!!session?.user}
      isVerified={session?.user?.emailVerified ?? false}
      isFull={room._count.members >= room.maxPlayers}
    />
  );
}
