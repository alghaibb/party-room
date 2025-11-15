"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface HeroContentProps {
  isAuthenticated: boolean;
}

export function HeroContent({ isAuthenticated }: HeroContentProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <div className="space-y-8 lg:space-y-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm border border-foreground/10 text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Join thousands of players</span>
          </div>

          {/* Headline with Creative Typography */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">
              <span className="block bg-[linear-gradient(135deg,var(--primary)_0%,var(--accent)_50%,var(--primary)_100%)] bg-clip-text text-transparent bg-size-[200%_auto]" style={{ animation: "shimmer 3s linear infinite" }}>
                Party
              </span>
              <span className="block text-foreground/90 mt-2">Together</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground/80 leading-relaxed max-w-xl">
              Create virtual spaces where friends connect, games come alive, and memories are made in real-time.
            </p>
          </div>

          {/* CTA Buttons - Unique Style */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {isAuthenticated ? (
              <Button asChild variant="modern" size="modern-md">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="modern" size="modern-md">
                  <Link href="/sign-up">
                    Start Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="modern-outline" size="modern-md">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </>
            )}
          </div>

          {/* Trust Indicators - Minimalist */}
          <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground/60">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Instant access</span>
            </div>
          </div>
        </div>

        {/* Right Column - Visual Element */}
        <div
          className="relative hidden lg:block"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <div className="relative aspect-square">
            {/* Glassmorphic Cards */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-3xl bg-background/40 backdrop-blur-xl border border-foreground/10 rotate-12 shadow-2xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 rounded-3xl bg-background/30 backdrop-blur-xl border border-foreground/10 -rotate-12 shadow-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-3xl bg-[linear-gradient(135deg,var(--primary)/20,var(--accent)/20)] backdrop-blur-xl border border-foreground/10 rotate-45 shadow-2xl" />
            
            {/* Floating Elements */}
            <div className="absolute top-10 right-20 w-20 h-20 rounded-2xl bg-primary/30 backdrop-blur-sm rotate-45" style={{ animation: "float-rotate 15s ease-in-out infinite" }} />
            <div className="absolute bottom-20 left-10 w-16 h-16 rounded-full bg-accent/30 backdrop-blur-sm" style={{ animation: "float 20s ease-in-out infinite reverse" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

