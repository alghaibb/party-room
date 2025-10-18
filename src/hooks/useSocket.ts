import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { authClient } from "@/lib/auth-client";
import { env } from "@/lib/env";

let socket: Socket | null = null;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Only initialize socket if we have a session
    const initializeSocket = async () => {
      try {
        const { data: session } = await authClient.getSession();

        if (session?.user && !socket) {
          socket = io(env.NEXT_PUBLIC_BASE_URL.toString(), {
            path: "/api/socketio",
            auth: {
              userId: session.user.id,
            },
          });

          socket.on("connect", () => {
            console.log("Connected to socket server");
            setIsConnected(true);
            setSocketId(socket!.id || null);
          });

          socket.on("disconnect", () => {
            console.log("Disconnected from socket server");
            setIsConnected(false);
            setSocketId(null);
          });

          socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
            setIsConnected(false);
          });

          socketRef.current = socket;
        }
      } catch (error) {
        console.error("Failed to get session for socket:", error);
      }
    };

    initializeSocket();

    return () => {
      // Don't disconnect on unmount, keep connection alive
      // socket will be cleaned up when the app closes
    };
  }, []);

  const joinRoom = (roomId: string, userId: string) => {
    socket?.emit("join-room", { roomId, userId });
  };

  const leaveRoom = (roomId: string, userId: string) => {
    socket?.emit("leave-room", { roomId, userId });
  };

  const sendMessage = (roomId: string, userId: string, content: string, type: "text" | "emoji" = "text") => {
    socket?.emit("send-message", { roomId, userId, content, type });
  };

  const startTyping = (roomId: string, userId: string) => {
    socket?.emit("typing-start", { roomId, userId });
  };

  const stopTyping = (roomId: string, userId: string) => {
    socket?.emit("typing-stop", { roomId, userId });
  };

  const updatePresence = (userId: string, status: "online" | "away" | "busy") => {
    socket?.emit("update-presence", { userId, status });
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    socket?.on(event, callback);
  };

  const off = (event: string, callback?: (...args: any[]) => void) => {
    if (callback) {
      socket?.off(event, callback);
    } else {
      socket?.off(event);
    }
  };

  const disconnect = () => {
    socket?.disconnect();
    socket = null;
    setIsConnected(false);
    setSocketId(null);
    socketRef.current = null;
  };

  return {
    socket: socketRef.current,
    isConnected,
    socketId,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping,
    updatePresence,
    on,
    off,
    disconnect,
  };
};
