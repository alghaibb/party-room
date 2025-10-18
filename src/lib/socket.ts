import { Server as NetServer } from "http";
import { NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";
import prisma from "@/lib/prisma";
import { env } from "./env";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

export const initSocketIO = (httpServer: NetServer): ServerIO => {
  const io = new ServerIO(httpServer, {
    path: "/api/socketio",
    cors: {
      origin: env.NEXT_PUBLIC_BASE_URL,
      methods: ["GET", "POST"],
    },
  });

  // Store active users and their socket connections
  const activeUsers = new Map<string, { socketId: string; roomId?: string }>();
  const roomUsers = new Map<string, Set<string>>();

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user joining a room
    socket.on("join-room", async (data: { roomId: string; userId: string }) => {
      try {
        const { roomId, userId } = data;

        // Verify user is a member of the room
        const membership = await prisma.roomMember.findUnique({
          where: {
            roomId_userId: {
              roomId,
              userId,
            },
          },
          include: {
            user: true,
          },
        });

        if (!membership) {
          socket.emit("error", { message: "You are not a member of this room" });
          return;
        }

        // Update user's active room
        activeUsers.set(userId, { socketId: socket.id, roomId });

        // Add user to room
        if (!roomUsers.has(roomId)) {
          roomUsers.set(roomId, new Set());
        }
        roomUsers.get(roomId)!.add(userId);

        socket.join(roomId);

        // Notify others in the room
        socket.to(roomId).emit("user-joined", {
          userId,
          displayName: membership.user.displayUsername || membership.user.name,
          joinedAt: new Date(),
        });

        // Send current room users to the new user
        const currentUsers = Array.from(roomUsers.get(roomId)!).map((uid) => {
          const userData = activeUsers.get(uid);
          return userData ? { userId: uid, socketId: userData.socketId } : null;
        }).filter(Boolean);

        socket.emit("room-users", currentUsers);

        console.log(`User ${userId} joined room ${roomId}`);
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    // Handle user leaving a room
    socket.on("leave-room", (data: { roomId: string; userId: string }) => {
      const { roomId, userId } = data;

      socket.leave(roomId);

      // Remove user from room tracking
      if (roomUsers.has(roomId)) {
        roomUsers.get(roomId)!.delete(userId);
      }

      // Update user's active room
      const userData = activeUsers.get(userId);
      if (userData?.roomId === roomId) {
        activeUsers.set(userId, { socketId: socket.id });
      }

      // Notify others in the room
      socket.to(roomId).emit("user-left", {
        userId,
        leftAt: new Date(),
      });

      console.log(`User ${userId} left room ${roomId}`);
    });

    // Handle chat messages
    socket.on("send-message", async (data: {
      roomId: string;
      userId: string;
      content: string;
      type?: "text" | "emoji";
    }) => {
      try {
        const { roomId, userId, content, type = "text" } = data;

        // Verify user is in the room
        if (!roomUsers.get(roomId)?.has(userId)) {
          socket.emit("error", { message: "You are not in this room" });
          return;
        }

        // Save message to database
        const message = await prisma.message.create({
          data: {
            roomId,
            userId,
            content,
            type: type.toUpperCase() as "TEXT" | "SYSTEM" | "GAME" | "EMOJI",
          },
          include: {
            user: true,
          },
        });

        // Broadcast message to room
        io.to(roomId).emit("new-message", {
          id: message.id,
          content: message.content,
          type: message.type,
          createdAt: message.createdAt,
          user: {
            id: message.user.id,
            displayName: message.user.displayUsername || message.user.name,
            username: message.user.username,
          },
        });

        console.log(`Message sent in room ${roomId} by user ${userId}`);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle typing indicators
    socket.on("typing-start", (data: { roomId: string; userId: string }) => {
      socket.to(data.roomId).emit("user-typing", {
        userId: data.userId,
        isTyping: true,
      });
    });

    socket.on("typing-stop", (data: { roomId: string; userId: string }) => {
      socket.to(data.roomId).emit("user-typing", {
        userId: data.userId,
        isTyping: false,
      });
    });

    // Handle user presence updates
    socket.on("update-presence", (data: { userId: string; status: "online" | "away" | "busy" }) => {
      const userData = activeUsers.get(data.userId);
      if (userData?.roomId) {
        socket.to(userData.roomId).emit("presence-update", {
          userId: data.userId,
          status: data.status,
          timestamp: new Date(),
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);

      // Find user by socket ID and clean up
      for (const [userId, userData] of activeUsers.entries()) {
        if (userData.socketId === socket.id) {
          const { roomId } = userData;

          // Remove from active users
          activeUsers.delete(userId);

          // Remove from room if they were in one
          if (roomId && roomUsers.has(roomId)) {
            roomUsers.get(roomId)!.delete(userId);

            // Notify others in the room
            socket.to(roomId).emit("user-left", {
              userId,
              leftAt: new Date(),
            });
          }

          break;
        }
      }
    });
  });

  return io;
};
