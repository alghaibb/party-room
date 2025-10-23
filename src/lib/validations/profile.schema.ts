import { z } from "zod";
import { nameSchema, emailSchema } from "./shared.schema";

export const profileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  displayUsername: z.string().min(3, "Display username must be at least 3 characters long").max(20, "Display username must be less than 20 characters long").trim().optional(),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export const profileImageSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 4.5 * 1024 * 1024, "File size must be less than 4.5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "File must be a JPEG, PNG, or WebP image"
    ),
});

export type ProfileImageValues = z.infer<typeof profileImageSchema>;