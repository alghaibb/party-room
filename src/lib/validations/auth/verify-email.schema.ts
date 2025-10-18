import { z } from "zod";
import { emailSchema } from "../shared.schema";

export const verifyEmailSchema = z.object({
  email: emailSchema,
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;
