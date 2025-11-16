import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { cache } from "react";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const getRoomDetails = cache(async (roomId: string) => {
  try {
    if (!roomId) {
      throw new Error("Room ID is required");
    }

    const session = await getSession();
    if (!session?.user) {
      throw new Error("Not authenticated");
    }

    const room = await prisma.partyRoom.findUnique({
      where: { id: roomId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            displayUsername: true,
            username: true,
            image: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                displayUsername: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            joinedAt: "asc", // Owner first, then order by join time
          },
        },
        gameSessions: {
          where: {
            status: {
              in: ["waiting", "playing"],
            },
          },
          include: {
            game: true,
            results: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    displayUsername: true,
                    username: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1, // Most recent active session
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (!room) {
      redirect("/dashboard/rooms");
    }

    // Ensure members is always an array
    const members = Array.isArray(room.members) ? room.members : [];
    const gameSessions = Array.isArray(room.gameSessions) ? room.gameSessions : [];

    // Check if user is a member of the room
    const userMembership = members.find(member => member.userId === session.user.id);
    if (!userMembership && room.ownerId !== session.user.id) {
      // User is not a member and not the owner
      throw new Error("You are not a member of this room");
    }

    const currentGame = gameSessions[0] || null;

    return {
      id: room.id,
      name: room.name,
      description: room.description,
      code: room.code,
      maxPlayers: room.maxPlayers,
      isPublic: room.isPublic,
      isActive: room.isActive,
      createdAt: room.createdAt,
      owner: {
        id: room.owner.id,
        name: room.owner.displayUsername || room.owner.name,
        username: room.owner.username,
        image: room.owner.image,
      },
      members: members.map(member => ({
        id: member.id,
        userId: member.userId,
        joinedAt: member.joinedAt,
        isOnline: member.isOnline,
        user: {
          id: member.user.id,
          name: member.user.displayUsername || member.user.name,
          username: member.user.username,
          image: member.user.image,
        },
      })),
      currentGame: currentGame ? {
        id: currentGame.id,
        status: currentGame.status,
        game: currentGame.game,
        results: Array.isArray(currentGame.results) ? currentGame.results : [],
        startedAt: currentGame.startedAt,
      } : null,
      memberCount: room._count.members,
      isOwner: room.ownerId === session.user.id,
      currentUserId: session.user.id,
    };

  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error fetching room details:", error);
    throw error;
  }
});

export const getRoomMessages = cache(async (roomId: string) => {
  try {
    const session = await getSession();
    if (!session?.user) {
      throw new Error("Not authenticated");
    }

    // Get the last 50 messages by ordering descending and taking first 50, then reversing
    const messages = await prisma.message.findMany({
      where: { roomId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            displayUsername: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Order descending to get most recent first
      },
      take: 50, // Take the last 50 messages
    });

    // Reverse to get chronological order (oldest to newest)
    messages.reverse();

    return messages.map(message => ({
      id: message.id,
      content: message.content,
      userId: message.userId,
      roomId: message.roomId,
      createdAt: message.createdAt,
      user: {
        id: message.user.id,
        name: message.user.displayUsername || message.user.name,
        username: message.user.username,
        image: message.user.image,
      },
    }));

  } catch (error) {
    console.error("Error fetching room messages:", error);
    return [];
  }
});

export const getAvailableGames = cache(async () => {
  try {
    const games = await prisma.game.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { category: "asc" },
        { name: "asc" },
      ],
    });

    return games.map(game => ({
      id: game.id,
      name: game.name,
      description: game.description,
      minPlayers: game.minPlayers,
      maxPlayers: game.maxPlayers,
      category: game.category,
    }));

  } catch (error) {
    console.error("Error fetching available games:", error);
    return [];
  }
});