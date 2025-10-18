import { z } from "zod";
import { passwordSchema } from "../shared.schema";

export const signInSchema = z.object({
  email: z.string().min(1, "Email or username is required").refine((value) => {
    // Check if it looks like an email (contains @) or a username (3-20 chars)
    if (value.includes("@")) {
      // Validate as email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    } else {
      // Validate as username
      return value.length >= 3 && value.length <= 20 && value.trim() === value;
    }
  }, {
    message: "Please enter a valid email address or username (3-20 characters)",
  }),
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

export type SignInValues = z.infer<typeof signInSchema>;
