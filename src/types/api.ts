/**
 * API response types and shared API types
 */

export interface RoomStats {
  totalActiveRooms: number;
  totalActivePlayers: number;
  gamesInProgress: number;
}

// Standard API error response
export interface ApiError {
  error: string;
}

// Standard action result type
export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };




