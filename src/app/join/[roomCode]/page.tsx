import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { roomCodeSchema } from "@/lib/validations/room/room.schema";
import { joinRoom } from "@/app/dashboard/rooms/actions";
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

  // If user is authenticated and verified, try to auto-join
  if (session?.user?.emailVerified) {
    const result = await joinRoom(validatedRoomCode);

    if (result.success && result.roomId) {
      // Redirect to the room
      redirect(`/dashboard/rooms/${result.roomId}`);
    }
    // If join failed (e.g., room full), show the page with error message
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
        error={result.message}
      />
    );
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
