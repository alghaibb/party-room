import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, emailOTP, username } from "better-auth/plugins";
import prisma from "./prisma";
import { sendOtpEmail, sendResetPasswordEmail } from "./email";
import { env } from "./env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(user) {
      await sendResetPasswordEmail({
        to: user.user.email,
        url: `${env.BETTER_AUTH_URL}/reset-password?token=${user.token}`,
        name: user.user.name,
      });
    },
  },
  plugins: [
    username(),
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await sendOtpEmail({
          to: email,
          otp,
          type: "email-verification",
        });
      },
      otpLength: 6,
      expiresIn: 10 * 60 * 1000,
      sendVerificationOnSignUp: true,
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
