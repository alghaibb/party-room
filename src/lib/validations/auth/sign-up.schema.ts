import { z } from "zod";
import {
  nameSchema,
  emailSchema,
  passwordWithConfirmSchema,
} from "../shared.schema";

export const signUpSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username must be less than 20 characters long").trim(),
    displayUsername: z.string().min(3, "Display username must be at least 3 characters long").max(20, "Display username must be less than 20 characters long").trim().optional(),
    name: nameSchema,
    email: emailSchema,
  })
  .and(passwordWithConfirmSchema);

export type SignUpValues = z.infer<typeof signUpSchema>;
