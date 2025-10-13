import { z } from "zod";
import {
  nameSchema,
  emailSchema,
  passwordWithConfirmSchema,
} from "../shared.schema";

export const signUpSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
  })
  .and(passwordWithConfirmSchema);

export type SignUpValues = z.infer<typeof signUpSchema>;
