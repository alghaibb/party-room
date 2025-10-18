import { Suspense } from "react";
import { VerifyEmailForm } from "./VerifyEmailForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address",
};

export default function VerifyEmailPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Verify your email
        </h1>
        <p className="text-muted-foreground text-sm">
          We've sent a verification code to your email address
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
        <VerifyEmailForm />
      </Suspense>

      <div className="text-center">
        <Button variant="link" asChild>
          <Link href="/sign-in">Back to sign in</Link>
        </Button>
      </div>
    </div>
  );
}
