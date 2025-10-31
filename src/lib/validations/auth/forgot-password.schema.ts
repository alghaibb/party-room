import { z } from "zod";
import { emailSchema } from "../shared.schema";

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
