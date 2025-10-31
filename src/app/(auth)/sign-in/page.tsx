import { SignInForm } from "./SignInForm";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { getSession } from "@/lib/get-session";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SparklesIcon, UsersIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default async function SignInPage() {
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
              <UsersIcon className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center animate-pulse">
              <SparklesIcon className="w-3 h-3 text-accent-foreground" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to continue the party?
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <SignInForm />

        <Divider />

        <div className="text-center space-y-3">
          <Button
            variant="link"
            asChild
            className="px-0 font-normal text-muted-foreground hover:text-foreground"
          >
            <Link href="/forgot-password">Forgot your password?</Link>
          </Button>
          <div className="text-sm text-muted-foreground">
            New to Party Room?{" "}
            <Button
              variant="link"
              asChild
              className="px-0 h-auto font-normal text-primary hover:text-primary/80"
            >
              <Link href="/sign-up">Create account</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
