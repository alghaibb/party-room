import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { cache } from "react";
import { ROOM_CONSTANTS } from "@/constants/room";

export const getActiveRooms = cache(async () => {
  try {
    const session = await getSession();
    if (!session?.user) {
      throw new Error("Not authenticated");
    }

    // Get active public rooms with member counts and owner info
    const activeRooms = await prisma.partyRoom.findMany({
      where: {
        isActive: true,
        isPublic: true,
      },
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
          select: {
            id: true,
            userId: true,
            isOnline: true,
            user: {
              select: {
                name: true,
                displayUsername: true,
                username: true,
                image: true,
              },
            },
          },
        },
        gameSessions: {
          where: {
            status: "playing",
          },
          include: {
            game: {
              select: {
                name: true,
                category: true,
              },
            },
          },
          take: 1,
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: ROOM_CONSTANTS.MAX_ACTIVE_ROOMS_DISPLAY,
    });

    return activeRooms.map(room => ({
      id: room.id,
      name: room.name,
      description: room.description,
      code: room.code,
      maxPlayers: room.maxPlayers,
      currentPlayers: room._count.members,
      onlineMembers: (Array.isArray(room.members) ? room.members : []).filter(m => m.isOnline).length,
      owner: {
        id: room.owner.id,
        name: room.owner.displayUsername || room.owner.name,
        username: room.owner.username,
        image: room.owner.image,
      },
      currentGame: (Array.isArray(room.gameSessions) && room.gameSessions[0]) ? {
        name: room.gameSessions[0].game.name,
        category: room.gameSessions[0].game.category,
      } : null,
      members: (Array.isArray(room.members) ? room.members : []).map(member => ({
        name: member.user.displayUsername || member.user.name,
        username: member.user.username,
        image: member.user.image,
        isOnline: member.isOnline,
      })),
      createdAt: room.createdAt,
    }));

  } catch (error) {
    console.error("Error fetching active rooms:", error);
    return [];
  }
});

export const getUserRooms = cache(async () => {
  try {
    const session = await getSession();
    if (!session?.user) {
      throw new Error("Not authenticated");
    }

    const userId = session.user.id;

    // Get rooms user is a member of
    const userRooms = await prisma.roomMember.findMany({
      where: {
        userId,
      },
      include: {
        room: {
          include: {
            owner: {
              select: {
                name: true,
                displayUsername: true,
                username: true,
                image: true,
              },
            },
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: "desc",
      },
      take: ROOM_CONSTANTS.MAX_RECENT_ROOMS,
    });

    return userRooms.map(membership => ({
      id: membership.room.id,
      name: membership.room.name,
      description: membership.room.description,
      code: membership.room.code,
      maxPlayers: membership.room.maxPlayers,
      currentPlayers: membership.room._count.members,
      owner: {
        name: membership.room.owner.displayUsername || membership.room.owner.name,
        username: membership.room.owner.username,
        image: membership.room.owner.image,
      },
      joinedAt: membership.joinedAt,
      isOnline: membership.isOnline,
    }));

  } catch (error) {
    console.error("Error fetching user rooms:", error);
    return [];
  }
});

export const getRoomStats = cache(async () => {
  try {
    const totalActiveRooms = await prisma.partyRoom.count({
      where: {
        isActive: true,
      },
    });

    const totalActivePlayers = await prisma.roomMember.count({
      where: {
        isOnline: true,
        room: {
          isActive: true,
        },
      },
    });

    const gamesInProgress = await prisma.gameSession.count({
      where: {
        status: "playing",
      },
    });

    return {
      totalActiveRooms,
      totalActivePlayers,
      gamesInProgress,
    };

  } catch (error) {
    console.error("Error fetching room stats:", error);
    return {
      totalActiveRooms: 0,
      totalActivePlayers: 0,
      gamesInProgress: 0,
    };
  }
});
