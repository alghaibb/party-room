import { z } from "zod";

export const createRoomSchema = z.object({
  name: z
    .string()
    .min(3, "Room name must be at least 3 characters")
    .max(50, "Room name must be less than 50 characters")
    .trim(),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
  maxMembers: z
    .number()
    .min(2, "Room must allow at least 2 members")
    .max(50, "Room cannot have more than 50 members"),
  isPrivate: z.boolean().optional(),
});

export type CreateRoomValues = z.infer<typeof createRoomSchema>;
