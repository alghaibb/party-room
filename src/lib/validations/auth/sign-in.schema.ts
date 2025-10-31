import { z } from "zod";
import { emailSchema, passwordSchema } from "../shared.schema";

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

export type SignInData = z.infer<typeof signInSchema>;
