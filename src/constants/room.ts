// Room-related constants to avoid magic numbers and improve maintainability

export const ROOM_CONSTANTS = {
  // Room Code
  CODE_LENGTH: 6,
  CODE_CHARACTERS: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  CODE_GENERATION_MAX_ATTEMPTS: 10,

  // Player Limits
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 16,
  DEFAULT_MAX_PLAYERS: 8,

  // UI Constants
  MAX_AVATAR_PREVIEW: 3,
  ROOM_NAME_MAX_LENGTH: 50,
  ROOM_DESCRIPTION_MAX_LENGTH: 200,

  // Game Constants
  AVERAGE_GAME_DURATION_MINUTES: 30,

  // Pagination
  MAX_RECENT_ROOMS: 10,
  MAX_ACTIVE_ROOMS_DISPLAY: 20,
} as const;

export const ROOM_STATUSES = {
  WAITING: "waiting",
  PLAYING: "playing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const ACTIVITY_TYPES = {
  ROOM_CREATED: "room_created",
  ROOM_JOINED: "room_joined",
  ROOM_LEFT: "room_left",
  ROOM_DELETED: "room_deleted",
  GAME_STARTED: "game_started",
  GAME_COMPLETED: "game_completed",
} as const;

// Type helpers
export type RoomStatus = typeof ROOM_STATUSES[keyof typeof ROOM_STATUSES];
export type ActivityType = typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES];
