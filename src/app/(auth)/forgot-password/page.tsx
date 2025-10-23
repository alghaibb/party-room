import Link from "next/link";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-muted-foreground text-sm">
          No worries! Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <ForgotPasswordForm />

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Remember your password?{" "}
          <Button variant="link" size="sm" asChild className="p-0">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </p>
      </div>
    </div>
  );
}
