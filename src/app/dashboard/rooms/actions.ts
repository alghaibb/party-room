"use server";

import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { roomCodeSchema, RoomCode, deleteRoomSchema } from "@/lib/validations/room/room.schema";

export async function joinRoom(roomCode: RoomCode) {
  try {
    // Validate room code format
    const validationResult = roomCodeSchema.safeParse(roomCode);
    if (!validationResult.success) {
      return {
        success: false,
        message: "Invalid room code format. Room codes must be 6 uppercase letters and numbers.",
      };
    }

    const session = await getSession();
    if (!session?.user) {
      return {
        success: false,
        message: "You must be logged in to join a room",
      };
    }

    if (!session.user.emailVerified) {
      return {
        success: false,
        message: "Please verify your email address to join rooms",
      };
    }

    const validatedRoomCode = validationResult.data;

    // Find the room by code
    const room = await prisma.partyRoom.findUnique({
      where: { code: validatedRoomCode },
      include: {
        _count: {
          select: { members: true }
        }
      }
    });

    if (!room) {
      return {
        success: false,
        message: "Room not found. Please check the room code.",
      };
    }

    if (!room.isActive) {
      return {
        success: false,
        message: "This room is no longer active.",
      };
    }

    if (room._count.members >= room.maxPlayers) {
      return {
        success: false,
        message: "Room is full. Try again later.",
      };
    }

    // Check if user is already in the room
    const existingMembership = await prisma.roomMember.findUnique({
      where: {
        userId_roomId: {
          userId: session.user.id,
          roomId: room.id,
        },
      },
    });

    if (existingMembership) {
      // User already in room - update isOnline status
      await prisma.roomMember.update({
        where: {
          userId_roomId: {
            userId: session.user.id,
            roomId: room.id,
          },
        },
        data: {
          isOnline: true,
        },
      });
      revalidatePath("/dashboard/rooms");
      return {
        success: true,
        message: `Welcome back to ${room.name}!`,
        roomId: room.id,
        roomCode: room.code,
      };
    }

    // Add user to room
    await prisma.roomMember.create({
      data: {
        userId: session.user.id,
        roomId: room.id,
        isOnline: true,
      },
    });

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: session.user.id,
        type: "room_joined",
        data: {
          roomId: room.id,
          roomName: room.name,
          roomCode: room.code,
        },
      },
    });

    revalidatePath("/dashboard/rooms");

    return {
      success: true,
      message: `Successfully joined ${room.name}!`,
      roomId: room.id,
      roomCode: room.code,
    };

  } catch (error) {
    console.error("Error joining room:", error);
    return {
      success: false,
      message: "Failed to join room. Please try again.",
    };
  }
}

export async function leaveRoom(roomId: string) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return {
        success: false,
        message: "You must be logged in to leave a room",
      };
    }

    // Remove user from room
    await prisma.roomMember.delete({
      where: {
        userId_roomId: {
          userId: session.user.id,
          roomId: roomId,
        },
      },
    });

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: session.user.id,
        type: "room_left",
        data: {
          roomId,
        },
      },
    });

    revalidatePath("/dashboard/rooms");

    return {
      success: true,
      message: "Left room successfully",
    };

  } catch (error) {
    console.error("Error leaving room:", error);
    return {
      success: false,
      message: "Failed to leave room. Please try again.",
    };
  }
}

export async function deleteRoom(roomId: string) {
  try {
    // Validate room ID
    const validationResult = deleteRoomSchema.safeParse({ roomId });
    if (!validationResult.success) {
      return {
        success: false,
        message: "Invalid room ID",
      };
    }

    const session = await getSession();
    if (!session?.user) {
      return {
        success: false,
        message: "You must be logged in to delete a room",
      };
    }

    if (!session.user.emailVerified) {
      return {
        success: false,
        message: "Please verify your email address to manage rooms",
      };
    }

    // Check if room exists and user is the owner
    const room = await prisma.partyRoom.findUnique({
      where: { id: roomId },
      include: {
        _count: {
          select: { members: true }
        }
      }
    });

    if (!room) {
      return {
        success: false,
        message: "Room not found",
      };
    }

    if (room.ownerId !== session.user.id) {
      return {
        success: false,
        message: "You can only delete rooms that you own",
      };
    }

    // Delete the room (cascades to members, game sessions, etc.)
    await prisma.partyRoom.delete({
      where: { id: roomId },
    });

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: session.user.id,
        type: "room_deleted",
        data: {
          roomId,
          roomName: room.name,
          roomCode: room.code,
          memberCount: room._count.members,
        },
      },
    });

    revalidatePath("/dashboard/rooms");

    return {
      success: true,
      message: `Room "${room.name}" deleted successfully`,
      roomId, // Return roomId so client can broadcast the deletion
    };

  } catch (error) {
    console.error("Error deleting room:", error);
    return {
      success: false,
      message: "Failed to delete room. Please try again.",
    };
  }
}
