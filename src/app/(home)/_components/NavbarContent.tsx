"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconSparkles } from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface NavbarContentProps {
  isAuthenticated: boolean;
}

export function NavbarContent({ isAuthenticated }: NavbarContentProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Logo */}
      <Link
        href="/"
        prefetch={true}
        className="flex items-center gap-3 group transition-transform hover:scale-105"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--accent))] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <IconSparkles
              className="w-6 h-6 text-primary-foreground"
              strokeWidth={2}
            />
          </div>
          <div className="absolute -inset-1 bg-[linear-gradient(135deg,var(--primary),var(--accent))] rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity" />
        </div>
        <span className="text-xl font-black bg-[linear-gradient(135deg,var(--foreground),var(--foreground)/70)] bg-clip-text text-secondary-foreground">
          Party Room
        </span>
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex items-center gap-8">
        <Link
          href="#features"
          className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors relative group"
        >
          Features
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
        </Link>
        <Link
          href="#about"
          className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors relative group"
        >
          About
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
        </Link>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <Button
            asChild
            variant={scrolled ? "modern" : "ghost"}
            size="modern-sm"
            className={
              !scrolled
                ? "bg-background/60 backdrop-blur-sm border border-foreground/10 hover:bg-background/80"
                : ""
            }
          >
            <Link href="/dashboard" prefetch={true}>
              Dashboard
            </Link>
          </Button>
        ) : (
          <>
            <Button asChild variant="ghost" size="modern-sm">
              <Link href="/sign-in" prefetch={true}>
                Sign In
              </Link>
            </Button>
            <Button asChild variant="modern" size="modern-sm">
              <Link href="/sign-up" prefetch={true}>
                Get Started
              </Link>
            </Button>
          </>
        )}
      </div>
    </>
  );
}
