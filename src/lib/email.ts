import { Resend } from "resend";
import { env } from "./env";
import { ResetPasswordEmail } from "@/components/emails/ResetPasswordEmail";
import { EmailOTPVerification } from "@/components/emails/EmailOTPVerification";

const resend = new Resend(env.RESEND_API_KEY);

interface SendResetPasswordEmailValues {
  to: string;
  resetUrl: string;
}

export async function sendResetPasswordEmail({ to, resetUrl }: SendResetPasswordEmailValues) {
  await resend.emails.send({
    from: "noreply@codewithmj.com",
    to,
    subject: "Reset your password - Party Room",
    react: ResetPasswordEmail({ resetUrl, userEmail: to }),
  });
}

interface SendEmailOTPValues {
  to: string;
  otp: string;
  type: "sign-in" | "email-verification" | "forget-password";
}

export async function sendEmailOTP({ to, otp, type }: SendEmailOTPValues) {
  const subjectMap = {
    "sign-in": "Your sign-in code - Party Room",
    "email-verification": "Verify your email - Party Room",
    "forget-password": "Your password reset code - Party Room",
  };

  await resend.emails.send({
    from: "noreply@codewithmj.com",
    to,
    subject: subjectMap[type],
    react: EmailOTPVerification({ otp, type }),
  });
}