import { useState } from "react";
import { toast } from "sonner";
import { joinRoom, deleteRoom, leaveRoom } from "@/app/dashboard/rooms/actions";

// Centralized room action handlers for better maintainability
export function useRoomActions() {
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async (roomCode: string) => {
    setIsLoading(true);

    try {
      const result = await joinRoom(roomCode);

      if (!result?.success) {
        toast.error(result?.message || "Failed to join room");
        return false;
      }

      toast.success(result.message);

      // Optimistic navigation
      window.location.href = `/dashboard/rooms/${result.roomId}`;
      return true;

    } catch (error) {
      console.error("Error joining room:", error);
      toast.error("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId: string, ownerName: string) => {
    setIsLoading(true);

    try {
      const result = await deleteRoom(roomId);

      if (!result?.success) {
        toast.error(result?.message || "Failed to delete room");
        return false;
      }

      // Broadcast room deletion to all users in the room
      const broadcastFn = (window as typeof window & { broadcastRoomDeleted?: (ownerName: string) => void }).broadcastRoomDeleted;
      if (broadcastFn) {
        broadcastFn(ownerName);
      }

      toast.success(result.message);

      // Navigate back to rooms list
      setTimeout(() => {
        window.location.href = "/dashboard/rooms";
      }, 500);

      return true;

    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveRoom = async (roomId: string) => {
    setIsLoading(true);

    try {
      const result = await leaveRoom(roomId);

      if (!result?.success) {
        toast.error(result?.message || "Failed to leave room");
        return false;
      }

      toast.success(result.message);

      // Navigate back to rooms list
      window.location.href = "/dashboard/rooms";
      return true;

    } catch (error) {
      console.error("Error leaving room:", error);
      toast.error("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleJoinRoom,
    handleDeleteRoom,
    handleLeaveRoom,
  };
}
