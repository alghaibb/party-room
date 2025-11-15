import { MobileNav } from "./MobileNav";
import { NavbarContent } from "./NavbarContent";

interface LandingNavbarProps {
  isAuthenticated: boolean;
}

export function LandingNavbar({ isAuthenticated }: LandingNavbarProps) {
  return (
    <>
      {/* Desktop Navbar - Glassmorphic */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-20">
            <NavbarContent isAuthenticated={isAuthenticated} />
          </div>
        </div>

        {/* Glassmorphic Background */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xl border-b border-foreground/5 -z-10" />
      </nav>

      {/* Mobile Navigation - Fixed Bottom */}
      <MobileNav isAuthenticated={isAuthenticated} />
    </>
  );
}
