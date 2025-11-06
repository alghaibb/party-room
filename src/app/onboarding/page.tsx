import { redirect } from "next/navigation";
import { getUserOnboardingData } from "@/app/onboarding/actions";
import { OnboardingForm } from "./OnboardingForm";
import { UserIcon, SparklesIcon, CheckCircleIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const userData = await getUserOnboardingData();

  // Redirect if not logged in
  if (!userData) {
    redirect("/sign-in?redirectTo=/onboarding");
  }

  // Redirect if not email verified
  if (!userData.emailVerified) {
    redirect("/verify-email");
  }

  // Redirect if already onboarded
  if (userData.hasOnboarded) {
    redirect("/");
  }

  return (
    <div className="min-h-svh flex">
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary/20 via-secondary/10 to-accent/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-background/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-center">
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-12 h-12 text-primary animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4 tracking-tight">
            Almost Ready!
          </h1>
          <p className="text-lg text-muted-foreground max-w-md leading-relaxed mb-8">
            Just a few more details and you&apos;ll be ready to join the party
          </p>

          <div className="flex space-x-4 text-sm">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircleIcon className="w-4 h-4" />
              <span>Account Created</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircleIcon className="w-4 h-4" />
              <span>Email Verified</span>
            </div>
            <div className="flex items-center space-x-2 text-primary">
              <UserIcon className="w-4 h-4" />
              <span>Profile Setup</span>
            </div>
          </div>
        </div>

        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/40 rounded-full animate-ping" />
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-secondary/40 rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-accent/50 rounded-full animate-bounce" />
      </div>

      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <div className="w-full space-y-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-linear-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg">
                    <UserIcon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center animate-pulse">
                    <SparklesIcon className="w-3 h-3 text-accent-foreground" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
                  Complete Your Profile
                </h1>
                <p className="text-muted-foreground text-lg">
                  Set up your username and profile to get started
                </p>
              </div>
            </div>

            <OnboardingForm userName={userData.userName} />
          </div>
        </div>
      </div>
    </div>
  );
}
