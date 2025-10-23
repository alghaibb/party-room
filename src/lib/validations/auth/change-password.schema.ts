import {z} from "zod";
import { passwordSchema } from "../shared.schema";

export const changePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmNewPassword: passwordSchema,
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;