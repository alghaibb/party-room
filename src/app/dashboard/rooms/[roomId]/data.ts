import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { cache } from "react";
import { notFound } from "next/navigation";

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
      notFound();
    }

    // Check if user is a member of the room
    const userMembership = room.members.find(member => member.userId === session.user.id);
    if (!userMembership && room.ownerId !== session.user.id) {
      // User is not a member and not the owner
      throw new Error("You are not a member of this room");
    }

    const currentGame = room.gameSessions[0] || null;

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
      members: room.members.map(member => ({
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
        results: currentGame.results,
        startedAt: currentGame.startedAt,
      } : null,
      memberCount: room._count.members,
      isOwner: room.ownerId === session.user.id,
      currentUserId: session.user.id,
    };

  } catch (error) {
    console.error("Error fetching room details:", error);
    throw error;
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
