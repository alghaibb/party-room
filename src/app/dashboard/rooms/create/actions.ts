"use server";

import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createRoomSchema, CreateRoomData } from "@/lib/validations/room/room.schema";
import { generateRoomCode } from "@/lib/room-utils";

export async function createRoom(formData: FormData) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return {
        success: false,
        message: "You must be logged in to create a room",
      };
    }

    if (!session.user.emailVerified) {
      return {
        success: false,
        message: "Please verify your email address to create rooms",
      };
    }

    // Parse and validate form data
    const rawData = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      maxPlayers: parseInt(formData.get("maxPlayers") as string) || 8,
      isPublic: formData.get("isPublic") === "true",
    };

    const validationResult = createRoomSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        message: "Invalid room data. Please check your inputs.",
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const validatedData: CreateRoomData = validationResult.data;

    // Generate unique room code
    const roomCode = await generateRoomCode();

    // Create the room
    const newRoom = await prisma.partyRoom.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
        code: roomCode,
        maxPlayers: validatedData.maxPlayers,
        isPublic: validatedData.isPublic,
        ownerId: session.user.id,
      },
    });

    // Add the creator as the first member
    await prisma.roomMember.create({
      data: {
        userId: session.user.id,
        roomId: newRoom.id,
        isOnline: true,
      },
    });

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: session.user.id,
        type: "room_created",
        data: {
          roomId: newRoom.id,
          roomName: newRoom.name,
          roomCode: newRoom.code,
        },
      },
    });

    // Revalidate rooms page  
    revalidatePath("/dashboard/rooms");

    return {
      success: true,
      message: "Room created successfully!",
      roomId: newRoom.id,
      roomCode: newRoom.code,
    };

  } catch (error) {
    console.error("Error creating room:", error);
    return {
      success: false,
      message: "Failed to create room. Please try again.",
    };
  }
}
