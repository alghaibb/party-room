import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import { SignOutButton } from "@/components/SignOutButton";

export default async function Home() {
  const session = await getSession();

  // If not logged in, redirect to sign-in
  if (!session?.user) {
    redirect("/sign-in");
  }

  // If logged in but email not verified, redirect to verify email
  if (!session.user.emailVerified) {
    redirect("/verify-email");
  }

  // If email verified but not onboarded, redirect to onboarding
  if (!session.user.hasOnboarded) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Party Room! 🎉</h1>
        <p className="text-xl">
          Hello, {session.user.displayUsername || session.user.name}!
        </p>
        <p className="text-muted-foreground">
          You&apos;ve successfully completed onboarding. The main app features
          will be built here.
        </p>
      </div>

      <SignOutButton />
    </div>
  );
}
