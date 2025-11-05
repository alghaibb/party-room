import { z } from "zod";

import { ROOM_CONSTANTS } from "@/constants/room";

// Room code validation (6-digit alphanumeric)
export const roomCodeSchema = z
  .string()
  .min(ROOM_CONSTANTS.CODE_LENGTH, `Room code must be exactly ${ROOM_CONSTANTS.CODE_LENGTH} characters`)
  .max(ROOM_CONSTANTS.CODE_LENGTH, `Room code must be exactly ${ROOM_CONSTANTS.CODE_LENGTH} characters`)
  .regex(
    new RegExp(`^[A-Z0-9]{${ROOM_CONSTANTS.CODE_LENGTH}}$`),
    "Room code must contain only uppercase letters and numbers"
  )
  .trim();

// Join room validation
export const joinRoomSchema = z.object({
  roomCode: roomCodeSchema,
});

// Create room validation
export const createRoomSchema = z.object({
  name: z
    .string()
    .min(1, "Room name is required")
    .max(ROOM_CONSTANTS.ROOM_NAME_MAX_LENGTH, `Room name must be less than ${ROOM_CONSTANTS.ROOM_NAME_MAX_LENGTH} characters`)
    .trim(),
  description: z
    .string()
    .max(ROOM_CONSTANTS.ROOM_DESCRIPTION_MAX_LENGTH, `Description must be less than ${ROOM_CONSTANTS.ROOM_DESCRIPTION_MAX_LENGTH} characters`)
    .trim()
    .optional(),
  maxPlayers: z
    .number()
    .min(ROOM_CONSTANTS.MIN_PLAYERS, `Room must allow at least ${ROOM_CONSTANTS.MIN_PLAYERS} players`)
    .max(ROOM_CONSTANTS.MAX_PLAYERS, `Room cannot exceed ${ROOM_CONSTANTS.MAX_PLAYERS} players`),
  isPublic: z
    .boolean(),
});

// Room update validation
export const updateRoomSchema = z.object({
  name: z
    .string()
    .min(1, "Room name is required")
    .max(50, "Room name must be less than 50 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .trim()
    .optional(),
  maxPlayers: z
    .number()
    .min(2, "Room must allow at least 2 players")
    .max(16, "Room cannot exceed 16 players")
    .optional(),
  isPublic: z
    .boolean()
    .optional(),
});

// Delete room validation
export const deleteRoomSchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
});

export type RoomCode = z.infer<typeof roomCodeSchema>;
export type JoinRoomData = z.infer<typeof joinRoomSchema>;
export type CreateRoomData = z.infer<typeof createRoomSchema>;
export type UpdateRoomData = z.infer<typeof updateRoomSchema>;
export type DeleteRoomData = z.infer<typeof deleteRoomSchema>;
