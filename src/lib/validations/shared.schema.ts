import { z } from "zod";

// Basic field schemas
export const nameSchema = z.string().min(1, "Name is required").max(255).trim();

export const emailSchema = z
  .email("Please enter a valid email address")
  .trim()
  .toLowerCase();

// Password schemas
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(255);

// Password with confirm - for registration forms
export const passwordWithConfirmSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Common utility schemas
export const requiredStringSchema = z
  .string()
  .min(1, "This field is required")
  .trim();

export const optionalStringSchema = z.string().trim().optional();

export const urlSchema = z.url("Please enter a valid URL").optional();
