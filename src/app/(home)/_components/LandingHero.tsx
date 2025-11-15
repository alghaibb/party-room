import { HeroContent } from "./HeroContent";

interface LandingHeroProps {
  isAuthenticated: boolean;
}

export function LandingHero({ isAuthenticated }: LandingHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Unique Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent opacity-40" />

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        {/* Floating Orbs */}
        <div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px]"
          style={{ animation: "float 20s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/15 rounded-full blur-[120px]"
          style={{ animation: "float 25s ease-in-out infinite reverse" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px]"
          style={{ animation: "float 30s ease-in-out infinite" }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10 pt-20 pb-32">
        <HeroContent isAuthenticated={isAuthenticated} />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
        <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex justify-center p-2">
          <div className="w-1 h-3 bg-foreground/40 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
