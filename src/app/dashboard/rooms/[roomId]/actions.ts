"use server";

import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  GAME_SESSION_STATUS,
  GAME_ERRORS,
  GAME_VALIDATION,
} from "@/constants/game";

export async function updateMemberOnlineStatus(
  roomId: string,
  isOnline: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        userId_roomId: {
          userId: session.user.id,
          roomId: roomId,
        },
      },
    });

    if (!membership) {
      return { success: false, error: "Not a member of this room" };
    }

    const updated = await prisma.roomMember.update({
      where: {
        userId_roomId: {
          userId: session.user.id,
          roomId: roomId,
        },
      },
      data: {
        isOnline,
      },
    });

    revalidatePath(`/dashboard/rooms/${roomId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating member online status:", error);
    return { success: false, error: "Failed to update online status" };
  }
}

export async function saveMessage(
  roomId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        userId_roomId: {
          userId: session.user.id,
          roomId: roomId,
        },
      },
    });

    if (!membership) {
      return { success: false, error: "Not a member of this room" };
    }

    await prisma.message.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        roomId: roomId,
      },
    });

    revalidatePath(`/dashboard/rooms/${roomId}`);

    return { success: true };
  } catch (error) {
    console.error("Error saving message:", error);
    return { success: false, error: "Failed to save message" };
  }
}

export async function createGameSession(
  roomId: string,
  gameId: string
): Promise<{ success: boolean; gameSessionId?: string; error?: string }> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const room = await prisma.partyRoom.findUnique({
      where: { id: roomId },
      include: {
        members: true,
        gameSessions: {
          where: {
            status: {
              in: [GAME_SESSION_STATUS.WAITING, GAME_SESSION_STATUS.PLAYING],
            },
          },
        },
      },
    });

    if (!room) {
      return { success: false, error: GAME_ERRORS.ROOM_NOT_FOUND };
    }

    if (room.ownerId !== session.user.id) {
      return {
        success: false,
        error: GAME_ERRORS.ONLY_OWNER_CAN_START,
      };
    }

    if (room.gameSessions.length > 0) {
      return { success: false, error: GAME_ERRORS.GAME_IN_PROGRESS };
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return { success: false, error: GAME_ERRORS.GAME_NOT_FOUND };
    }

    if (!game.isActive) {
      return { success: false, error: GAME_ERRORS.GAME_INACTIVE };
    }

    const memberCount = room.members.length;
    if (memberCount < game.minPlayers || memberCount > game.maxPlayers) {
      return {
        success: false,
        error: `This game requires ${game.minPlayers}-${game.maxPlayers} players`,
      };
    }

    const gameSession = await prisma.gameSession.create({
      data: {
        roomId,
        gameId,
        status: GAME_SESSION_STATUS.WAITING,
      },
    });

    revalidatePath(`/dashboard/rooms/${roomId}`);

    return { success: true, gameSessionId: gameSession.id };
  } catch (error) {
    console.error("Error creating game session:", error);
    return { success: false, error: "Failed to create game session" };
  }
}

export async function startGame(
  roomId: string,
  gameSessionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const room = await prisma.partyRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return { success: false, error: "Room not found" };
    }

    if (room.ownerId !== session.user.id) {
      return { success: false, error: "Only room owner can start games" };
    }

    // Verify game session exists and is in waiting status
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: gameSessionId },
    });

    if (!gameSession) {
      return { success: false, error: "Game session not found" };
    }

    if (gameSession.status !== GAME_SESSION_STATUS.WAITING) {
      return { success: false, error: GAME_ERRORS.INVALID_STATUS };
    }

    if (gameSession.roomId !== roomId) {
      return { success: false, error: "Game session does not belong to this room" };
    }

    const members = await prisma.roomMember.findMany({
      where: {
        roomId,
      },
      select: {
        userId: true,
        isOnline: true,
      },
    });

    // Count online members - always count owner as online (they're calling this function)
    const ownerInMembers = members.some(m => m.userId === room.ownerId);
    let onlineMemberCount = members.filter(m => m.isOnline || m.userId === room.ownerId).length;

    // If owner is not in members list, add 1 to count
    if (!ownerInMembers) {
      onlineMemberCount += 1;
    }

    if (onlineMemberCount < GAME_VALIDATION.MIN_ONLINE_PLAYERS_TO_START) {
      return {
        success: false,
        error: `You need at least ${GAME_VALIDATION.MIN_ONLINE_PLAYERS_TO_START} online players to start a game (${onlineMemberCount} online)`,
      };
    }

    await prisma.gameSession.update({
      where: { id: gameSessionId },
      data: {
        status: GAME_SESSION_STATUS.PLAYING,
        startedAt: new Date(),
      },
    });

    revalidatePath(`/dashboard/rooms/${roomId}`);

    return { success: true };
  } catch (error) {
    console.error("Error starting game:", error);
    return { success: false, error: "Failed to start game" };
  }
}

export async function endGame(
  roomId: string,
  gameSessionId: string,
  results: Array<{ userId: string; score: number; won: boolean; position?: number }>
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const room = await prisma.partyRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return { success: false, error: "Room not found" };
    }

    if (room.ownerId !== session.user.id) {
      return { success: false, error: "Only room owner can end games" };
    }

    // Verify game session exists and is playing
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: gameSessionId },
    });

    if (!gameSession) {
      return { success: false, error: "Game session not found" };
    }

    if (
      gameSession.status !== GAME_SESSION_STATUS.PLAYING &&
      gameSession.status !== GAME_SESSION_STATUS.COMPLETED
    ) {
      return { success: false, error: GAME_ERRORS.INVALID_STATUS };
    }

    if (gameSession.status === GAME_SESSION_STATUS.COMPLETED) {
      return { success: true };
    }

    if (gameSession.roomId !== roomId) {
      return { success: false, error: "Game session does not belong to this room" };
    }

    await prisma.$transaction([
      ...results.map((result) =>
        prisma.gameResult.create({
          data: {
            userId: result.userId,
            gameSessionId,
            score: result.score,
            won: result.won,
            position: result.position,
          },
        })
      ),
      prisma.gameSession.update({
        where: { id: gameSessionId },
        data: {
          status: GAME_SESSION_STATUS.COMPLETED,
          endedAt: new Date(),
        },
      }),
    ]);

    revalidatePath(`/dashboard/rooms/${roomId}`);

    return { success: true };
  } catch (error) {
    console.error("Error ending game:", error);
    return { success: false, error: "Failed to end game" };
  }
}

export async function cancelGame(
  roomId: string,
  gameSessionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const room = await prisma.partyRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return { success: false, error: "Room not found" };
    }

    if (room.ownerId !== session.user.id) {
      return { success: false, error: "Only room owner can cancel games" };
    }

    // Verify game session exists
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: gameSessionId },
    });

    if (!gameSession) {
      return { success: false, error: "Game session not found" };
    }

    if (gameSession.roomId !== roomId) {
      return { success: false, error: "Game session does not belong to this room" };
    }

    // Allow canceling completed games so owner can start a new game

    await prisma.gameSession.delete({
      where: { id: gameSessionId },
    });

    revalidatePath(`/dashboard/rooms/${roomId}`);

    return { success: true };
  } catch (error) {
    console.error("Error canceling game:", error);
    return { success: false, error: "Failed to cancel game" };
  }
}

export async function submitGameAnswer(
  roomId: string,
  gameSessionId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _answer: string
): Promise<{ success: boolean; correct?: boolean; error?: string }> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        userId_roomId: {
          userId: session.user.id,
          roomId: roomId,
        },
      },
    });

    if (!membership) {
      return { success: false, error: "Not a member of this room" };
    }

    const gameSession = await prisma.gameSession.findUnique({
      where: { id: gameSessionId },
      include: {
        game: true,
      },
    });

    if (!gameSession) {
      return { success: false, error: "Game session not found" };
    }

    if (gameSession.status !== GAME_SESSION_STATUS.PLAYING) {
      return { success: false, error: GAME_ERRORS.INVALID_STATUS };
    }

    const existingResult = await prisma.gameResult.findUnique({
      where: {
        userId_gameSessionId: {
          userId: session.user.id,
          gameSessionId,
        },
      },
    });

    if (existingResult) {
      return { success: false, error: "You have already submitted an answer" };
    }

    return { success: true, correct: false };
  } catch (error) {
    console.error("Error submitting game answer:", error);
    return { success: false, error: "Failed to submit answer" };
  }
}

