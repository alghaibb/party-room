import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username, emailOTP } from "better-auth/plugins";
import { env } from "./env";
import { sendResetPasswordEmail, sendEmailOTP } from "./email";
import { APIError, createAuthMiddleware } from "better-auth/api";
import prisma from "@/lib/prisma";
import { passwordSchema } from "./validations/shared.schema";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 20,
    }),
    emailOTP({
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        await sendEmailOTP({
          to: email,
          otp,
          type,
        });
      },
    }),
  ],
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      prompt: "select_account",
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    },
  },
  emailAndPassword: {
    enabled: true,
    resetPasswordExpiresIn: 5 * 60,
    async sendResetPassword({ user, url }) {
      await sendResetPasswordEmail({
        to: user.email,
        resetUrl: url,
      });
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === "/sign-up/email" ||
        ctx.path === "/reset-password" ||
        ctx.path === "/change-password"
      ) {
        const password = ctx.body.password || ctx.body.newPassword;

        const { error } = passwordSchema.safeParse(password);

        if (error) {
          throw new APIError("BAD_REQUEST", {
            message: "Invalid password",
          })
        }
      }
    })
  }
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
