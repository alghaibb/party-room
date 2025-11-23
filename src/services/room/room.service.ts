/**
 * Room service - handles all room-related data access and business logic
 */

import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { cache } from "react";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import type { RoomDetails } from "@/types";

export const roomService = {
  /**
   * Get detailed room information including members and current game
   */
  getRoomDetails: cache(async (roomId: string): Promise<RoomDetails> => {
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
              joinedAt: "asc",
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
            take: 1,
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

      const members = Array.isArray(room.members) ? room.members : [];
      const gameSessions = Array.isArray(room.gameSessions)
        ? room.gameSessions
        : [];

      // Check if user is a member of the room
      const userMembership = members.find(
        (member) => member.userId === session.user.id
      );
      if (!userMembership && room.ownerId !== session.user.id) {
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
        members: members.map((member) => ({
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
        currentGame: currentGame
          ? {
              id: currentGame.id,
              status: currentGame.status,
              game: currentGame.game,
              results: Array.isArray(currentGame.results)
                ? currentGame.results
                : [],
              startedAt: currentGame.startedAt,
            }
          : null,
        memberCount: room._count.members,
        isOwner: room.ownerId === session.user.id,
        currentUserId: session.user.id,
      };
    } catch (error) {
      if (isRedirectError(error)) throw error;
      console.error("Error fetching room details:", error);
      throw error;
    }
  }),
};



