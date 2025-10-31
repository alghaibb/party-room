import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface ForgotPasswordProps {
  url: string;
  name?: string;
}

export const ForgotPassword = ({ url, name }: ForgotPasswordProps) => {
  const previewText = "Reset your Party Room password";

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
              We received a request to reset your password for your Party Room
              account. If you made this request, click the button below to
              create a new password.
            </Text>

            {/* Reset Button */}
            <Section className="text-center mb-6">
              <Button
                href={url}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg inline-block text-center no-underline"
              >
                Reset Your Password
              </Button>
            </Section>

            <Text className="text-gray-600 text-sm leading-relaxed mb-4">
              This link will expire in 1 hour for security reasons. If you
              didn&apos;t request a password reset, you can safely ignore this
              email - your account will remain secure.
            </Text>

            <Text className="text-gray-600 text-sm leading-relaxed mb-4">
              If the button above doesn&apos;t work, you can copy and paste this
              link into your browser:
            </Text>

            <Text className="text-xs text-blue-600 break-all bg-blue-50 p-3 rounded border font-mono">
              {url}
            </Text>

            <Text className="text-gray-600 text-sm leading-relaxed mt-6">
              Need help? Contact our support team at{" "}
              <Link
                href="mailto:support@codewithmj.com"
                className="text-blue-600 hover:text-blue-800"
              >
                support@codewithmj.com
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section className="bg-gray-100 rounded-b-lg px-8 py-6">
            <Text className="text-xs text-gray-500 text-center leading-relaxed">
              © {new Date().getFullYear()} Party Room. All rights reserved.
              <br />
              This email was sent to you because a password reset was requested
              for your account.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ForgotPassword;
