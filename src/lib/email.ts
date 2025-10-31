import { Resend } from "resend";
import { render } from "@react-email/render";
import { env } from "./env";
import { VerifyEmail } from "./emails/verify-email";
import { ForgotPassword } from "./emails/forgot-password";

const resend = new Resend(env.RESEND_API_KEY);

interface SendOtpEmailValues {
  to: string;
  otp: string;
  type: "email-verification";
}

interface SendResetPasswordEmailValues {
  to: string;
  url: string;
  name?: string;
}

export async function sendOtpEmail({ to, otp, type }: SendOtpEmailValues) {
  try {
    if (type === "email-verification") {
      const emailHtml = await render(VerifyEmail({ otp }));

      await resend.emails.send({
        from: "noreply@codewithmj.com",
        to,
        subject: `Your verification code: ${otp}`,
        html: emailHtml,
      });
    }
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw error;
  }
}

export async function sendResetPasswordEmail({
  to,
  url,
  name,
}: SendResetPasswordEmailValues) {
  try {
    const emailHtml = await render(ForgotPassword({ url, name }));

    await resend.emails.send({
      from: "noreply@codewithmj.com",
      to,
      subject: "Reset your password",
      html: emailHtml,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw error;
  }
}
