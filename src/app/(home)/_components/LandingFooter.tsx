import Link from "next/link";
import { Users } from "lucide-react";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-foreground/5 bg-background/40 backdrop-blur-xl">
      <div className="container mx-auto px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-3 group transition-transform hover:scale-105"
            >
              <div className="w-10 h-10 rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--accent))] flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-black bg-[linear-gradient(135deg,var(--foreground),var(--foreground)/70)] bg-clip-text text-transparent">
                Party Room
              </span>
            </Link>
            <p className="text-sm text-muted-foreground/60 leading-relaxed">
              Connect, play, and party together.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">
              Product
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#features"
                  className="text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">
              Account
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/sign-in"
                  className="text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#privacy"
                  className="text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#terms"
                  className="text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-foreground/5 text-center text-sm text-muted-foreground/60">
          <p>© {currentYear} Party Room. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
