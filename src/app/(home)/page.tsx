import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import { LandingNavbar } from "./_components/LandingNavbar";
import { LandingHero } from "./_components/LandingHero";
import { LandingFeatures } from "./_components/LandingFeatures";
import { LandingCTA } from "./_components/LandingCTA";
import { LandingFooter } from "./_components/LandingFooter";
import { Metadata } from "next";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Party Room - Connect, Play, Party Together",
  description:
    "Create virtual party rooms, play games with friends, and make unforgettable memories together.",
  // Performance optimizations
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
};

// Enable static generation for better performance
export const dynamic = "force-dynamic"; // Keep dynamic for auth checks, but optimize below

export default async function Home() {
  // Single session call - React cache will deduplicate
  const session = await getSession();
  const isAuthenticated = !!session?.user;

  // If logged in but not verified, redirect to verify email
  if (session?.user && !session.user.emailVerified) {
    redirect("/verify-email");
  }

  // If logged in but not onboarded, redirect to onboarding
  if (
    session?.user &&
    session.user.emailVerified &&
    !session.user.hasOnboarded
  ) {
    redirect("/onboarding");
  }

  // Show landing page for everyone (authenticated and unauthenticated users)
  // Pass isAuthenticated as prop to avoid multiple session calls
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar isAuthenticated={isAuthenticated} />
      <main className="flex-1 pb-20 md:pb-0">
        <LandingHero isAuthenticated={isAuthenticated} />
        <LandingFeatures />
        <LandingCTA isAuthenticated={isAuthenticated} />
      </main>
      <LandingFooter />
    </div>
  );
}
