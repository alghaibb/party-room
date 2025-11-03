import { z } from "zod";
import { passwordSchema } from "../shared.schema";

// Custom validation for email or username
const emailOrUsernameSchema = z
  .string()
  .min(1, "Email or username is required")
  .trim()
  .refine(
    (value) => {
      // Check if it's a valid email or a valid username
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernameRegex = /^[a-zA-Z0-9_-]+$/;

      return emailRegex.test(value) || usernameRegex.test(value);
    },
    {
      message: "Please enter a valid email address or username",
    }
  );

export const signInSchema = z.object({
  emailOrUsername: emailOrUsernameSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

export type SignInData = z.infer<typeof signInSchema>;
