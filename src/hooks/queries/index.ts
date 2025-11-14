// React Query hooks for data fetching
export { useUserStats } from "./use-user-stats";
export { useActiveRooms } from "./use-active-rooms";
export { useUserRooms } from "./use-user-rooms";
export { useRoomStats } from "./use-room-stats";
export { useRoomDetails } from "./use-room-details";
export { useRoomMessages } from "./use-room-messages";
export { useAvailableGames } from "./use-available-games";
export { useInvalidateRooms } from "./use-invalidate-rooms";

// Export types for reuse
export type {
  UserStats,
  RoomStats,
  ActiveRoom,
  UserRoom,
  RoomDetails,
  RoomMessage,
  Game,
} from "@/types/queries";

