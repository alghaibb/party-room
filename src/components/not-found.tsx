"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  IconHome,
  IconArrowLeft,
  IconMoodSad,
  IconRocket,
} from "@tabler/icons-react";

interface NotFoundProps {
  showSidebar?: boolean;
}

export function NotFound({ showSidebar }: NotFoundProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center px-4 overflow-hidden pt-20 sm:pt-0 ${showSidebar || isDashboard ? "" : "fixed"}`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="max-w-2xl w-full text-center space-y-6 sm:space-y-8 relative z-10">
        {/* Animated 404 Number */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse -z-10" />
          <h1 className="relative text-9xl md:text-[12rem] font-bold bg-linear-to-br from-primary via-primary/80 to-accent bg-clip-text text-transparent leading-none">
            404
          </h1>
        </div>

        {/* Icon with Animation */}
        <div className="flex justify-center pt-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full animate-pulse -z-10" />
            <div className="relative bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-full p-6 shadow-lg hover:scale-105 transition-transform duration-300">
              <IconMoodSad
                className="w-16 h-16 text-primary"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 pt-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            Oops! The page you&apos;re looking for seems to have vanished into
            the party void. Don&apos;t worry, let&apos;s get you back on track!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          {isDashboard ? (
            <>
              <Button
                asChild
                variant="modern"
                size="modern-md"
                className="group shadow-lg hover:shadow-xl transition-all"
              >
                <Link
                  href="/dashboard"
                  prefetch={true}
                  className="flex items-center gap-2"
                >
                  <IconHome className="w-5 h-5" />
                  Back to Dashboard
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="modern-md"
                className="group border-foreground/20 hover:bg-accent/50 transition-all"
              >
                <Link
                  href="/dashboard/rooms"
                  prefetch={true}
                  className="flex items-center gap-2"
                >
                  <IconRocket className="w-5 h-5" />
                  Browse Rooms
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="modern"
                size="modern-md"
                className="group shadow-lg hover:shadow-xl transition-all"
              >
                <Link
                  href="/"
                  prefetch={true}
                  className="flex items-center gap-2"
                >
                  <IconHome className="w-5 h-5" />
                  Go Home
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="modern-md"
                className="group border-foreground/20 hover:bg-accent/50 transition-all"
              >
                <Link
                  href="/sign-in"
                  prefetch={true}
                  className="flex items-center gap-2"
                >
                  <IconRocket className="w-5 h-5" />
                  Sign In
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Back Button */}
        <div className="pt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
