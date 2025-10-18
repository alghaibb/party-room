import { env } from "@/lib/env";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordEmailProps {
  resetUrl: string;
  userEmail: string;
}

const baseUrl = env.NEXT_PUBLIC_BASE_URL;

export const ResetPasswordEmail = ({
  resetUrl,
  userEmail,
}: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your password for Party Room</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src={`${baseUrl}/logo.png`}
            width="120"
            height="120"
            alt="Party Room"
            style={logo}
          />
        </Section>

        <Heading style={h1}>Reset your password</Heading>

        <Text style={text}>Hi there,</Text>

        <Text style={text}>
          We received a request to reset your password for your Party Room
          account ({userEmail}). If you didn&apos;t make this request, you can
          safely ignore this email.
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={resetUrl}>
            Reset Password
          </Button>
        </Section>

        <Text style={text}>
          If the button doesn&apos;t work, you can copy and paste this link into
          your browser:
        </Text>

        <Text style={link}>{resetUrl}</Text>

        <Hr style={hr} />

        <Text style={footer}>
          This link will expire in 5 minutes for security reasons.
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

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#fbbf24",
  borderRadius: "8px",
  color: "#000",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const link = {
  color: "#6366f1",
  fontSize: "14px",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
  margin: "16px 0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "16px 0",
};

export default ResetPasswordEmail;
