"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isAuthenticated: boolean;
}

export function MobileNav({ isAuthenticated }: MobileNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      label: "Features",
      href: "#features",
      icon: Sparkles,
    },
    ...(isAuthenticated
      ? [
          {
            label: "Dashboard",
            href: "/dashboard",
            icon: Users,
          },
        ]
      : [
          {
            label: "Sign In",
            href: "/sign-in",
            icon: User,
          },
        ]),
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border/40"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-lg transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
