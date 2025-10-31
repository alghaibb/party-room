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

interface VerifyEmailProps {
  otp: string;
  name?: string;
}

export const VerifyEmail = ({ otp, name }: VerifyEmailProps) => {
  const previewText = `Your verification code: ${otp}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body className="bg-gray-50 font-sans">
        <Container className="mx-auto py-12 px-4 max-w-2xl">
          {/* Header */}
          <Section className="bg-white rounded-t-lg px-8 py-6 border-b border-gray-200 text-center">
            <Heading className="text-2xl font-bold text-gray-900 m-0 mb-2">
              Party Room
            </Heading>
            <Text className="text-sm text-gray-600 m-0">
              Where connections come alive
            </Text>
          </Section>

          {/* Main Content */}
          <Section className="bg-white px-8 py-8">
            <Heading className="text-xl font-semibold text-gray-900 mb-4">
              {name ? `Hi ${name},` : "Hi there,"}
            </Heading>

            <Text className="text-gray-700 text-base leading-relaxed mb-6">
              Welcome to Party Room! We&apos;re excited to have you join our
              community. To complete your account setup and start connecting
              with others, please verify your email address using the code
              below.
            </Text>

            {/* OTP Display */}
            <Section className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center mb-6">
              <Text className="text-sm font-medium text-blue-800 mb-4 uppercase tracking-wide">
                Your Verification Code
              </Text>
              <Text className="text-4xl font-bold text-blue-900 mb-4 tracking-widest">
                {otp}
              </Text>
              <Text className="text-xs text-blue-700">
                This code will expire in 10 minutes
              </Text>
            </Section>

            <Text className="text-gray-600 text-sm leading-relaxed mb-4">
              If you didn&apos;t create an account with Party Room, you can
              safely ignore this email. Your email address will not be added to
              our platform.
            </Text>

            <Text className="text-gray-600 text-sm leading-relaxed">
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@codewithmj.com"
                className="text-blue-600 hover:text-blue-800"
              >
                support@codewithmj.com
              </a>
            </Text>
          </Section>

          {/* Footer */}
          <Section className="bg-gray-100 rounded-b-lg px-8 py-6">
            <Text className="text-xs text-gray-500 text-center leading-relaxed">
              © {new Date().getFullYear()} Party Room. All rights reserved.
              <br />
              This email was sent to you because you signed up for Party Room.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerifyEmail;
