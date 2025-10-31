import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url().min(1),
    DIRECT_URL: z.url().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url().min(1),
    RESEND_API_KEY: z.string().min(1),
    TWILIO_ACCOUNT_SID: z.string().min(1),
    TWILIO_AUTH_TOKEN: z.string().min(1),
    TWILIO_PHONE_NUMBER: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.url().min(1),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
});
