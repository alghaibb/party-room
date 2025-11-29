/**
 * Room messages service - handles message-related data access
 */

import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { cache } from "react";
import type { RoomMessage } from "@/types";

export const roomMessagesService = {
  /**
   * Get the last 50 messages for a room
   */
  getRoomMessages: cache(async (roomId: string): Promise<RoomMessage[]> => {
    try {
      const session = await getSession();
      if (!session?.user) {
        throw new Error("Not authenticated");
      }

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
          createdAt: "desc",
        },
        take: 50,
      });

      // Reverse to get chronological order (oldest to newest)
      messages.reverse();

      type MessageResult = typeof messages[0];
      return messages.map((message: MessageResult) => ({
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
      throw error;
    }
  }),
};



