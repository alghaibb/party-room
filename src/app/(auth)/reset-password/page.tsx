import { Suspense } from "react";
import Link from "next/link";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset your password",
};

function ResetPasswordSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-8 w-64" />
        <Skeleton className="mx-auto h-4 w-80" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-64" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-48" />
        </div>

        <Skeleton className="h-10 w-full" />
      </div>

      <div className="text-center">
        <Skeleton className="mx-auto h-4 w-48" />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset your password
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your new password below
        </p>
      </div>

      {/* Reset Password Form */}
      <Suspense fallback={<ResetPasswordSkeleton />}>
        <ResetPasswordForm />
      </Suspense>

      {/* Sign In Link */}
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
