/* eslint-disable @next/next/no-img-element */
import { env } from "@/lib/env";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailOTPVerificationProps {
  otp: string;
  type: "sign-in" | "email-verification" | "forget-password";
}

const typeMessages = {
  "sign-in": {
    title: "Sign In Code",
    description: "Use this code to sign in to your Party Room account:",
  },
  "email-verification": {
    title: "Verify Your Email",
    description: "Use this code to verify your email address:",
  },
  "forget-password": {
    title: "Password Reset Code",
    description: "Use this code to reset your password:",
  },
};

const baseUrl = env.NEXT_PUBLIC_BASE_URL;

export const EmailOTPVerification = ({
  otp,
  type,
}: EmailOTPVerificationProps) => (
  <Html>
    <Head />
    <Preview>{typeMessages[type].title} - Party Room</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <img
            src={`${baseUrl}/logo.png`}
            width="120"
            height="120"
            alt="Party Room"
            style={logo}
          />
        </Section>

        <Heading style={h1}>{typeMessages[type].title}</Heading>

        <Text style={text}>Hi there,</Text>

        <Text style={text}>{typeMessages[type].description}</Text>

        <Section style={codeSection}>
          <Text style={code}>{otp}</Text>
        </Section>

        <Text style={text}>
          This code will expire in 5 minutes. If you didn&apos;t request this
          code, please ignore this email.
        </Text>

        <Text style={footer}>
          If you have any questions, feel free to contact our support team.
        </Text>

        <Text style={footer}>
          Best regards,
          <br />
          The Party Room Team
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 40px 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const logoContainer = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const logo = {
  margin: "0 auto",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
};

const codeSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const code = {
  backgroundColor: "#f6f6f6",
  border: "1px solid #ddd",
  borderRadius: "8px",
  color: "#333",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "8px",
  padding: "16px 24px",
  margin: "0",
  display: "inline-block",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "16px 0",
};
