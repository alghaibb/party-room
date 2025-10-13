import { z } from "zod";
import { passwordWithConfirmSchema } from "../shared.schema";

export const resetPasswordSchema = z.object({
  password: passwordWithConfirmSchema,
});

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
