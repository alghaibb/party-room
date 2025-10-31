import { z } from "zod";

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(255, "Name must be less than 255 characters")
  .trim();

export const emailSchema = z
  .email("Invalid email address")
  .min(1, "Email is required")
  .trim()
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(255, "Password must be less than 255 characters")
  .trim();

export const usernameSchema = z
  .string()
  .min(1, "Username is required")
  .max(255, "Username must be less than 255 characters")
  .trim();

export const otpSchema = z
  .string()
  .min(6, "OTP must be 6 digits")
  .max(6, "OTP must be 6 digits")
  .trim()
  .regex(/^\d+$/, "OTP must contain only digits");
