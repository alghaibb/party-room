"use server";

import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveMessage(
  roomId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify user is a member of the room
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

