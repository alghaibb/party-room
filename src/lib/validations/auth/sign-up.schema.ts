import { z } from "zod";
import { nameSchema, emailSchema, passwordSchema } from "../shared.schema";

export const signUpSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpData = z.infer<typeof signUpSchema>;
