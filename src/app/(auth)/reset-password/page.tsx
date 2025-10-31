import { ResetPasswordForm } from "./ResetPasswordForm";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { getSession } from "@/lib/get-session";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { KeyIcon, UsersIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your account",
};

export default async function ResetPasswordPage() {
  const session = await getSession();
  const user = session?.user;

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-linear-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg">
              <KeyIcon className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center animate-pulse">
              <UsersIcon className="w-3 h-3 text-accent-foreground" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
            Set new password
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose a strong password for your account
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>

        <Divider />

        <div className="text-center space-y-3">
          <div className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Button
              variant="link"
              asChild
              className="px-0 h-auto font-normal text-primary hover:text-primary/80"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
