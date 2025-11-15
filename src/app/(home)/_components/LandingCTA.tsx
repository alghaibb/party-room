import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface LandingCTAProps {
  isAuthenticated: boolean;
}

export function LandingCTA({ isAuthenticated }: LandingCTAProps) {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Unique Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Content Card - Glassmorphic */}
          <div className="relative p-12 md:p-16 rounded-3xl bg-background/40 backdrop-blur-xl border border-foreground/10 shadow-2xl">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                  <span className="block">Ready to start</span>
                  <span className="block bg-[linear-gradient(135deg,var(--primary),var(--accent))] bg-clip-text text-transparent">
                    your party?
                  </span>
                </h2>
                <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mx-auto">
                  Join thousands of players creating unforgettable gaming
                  experiences together.
                </p>
              </div>

              <div className="pt-4">
                {isAuthenticated ? (
                  <Button asChild variant="modern" size="modern-lg">
                    <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="modern" size="modern-lg">
                    <Link href="/sign-up">
                      Get Started Free
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
