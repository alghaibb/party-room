"use client";

import {
  Users,
  Gamepad2,
  MessageSquare,
  Shield,
  Zap,
  Heart,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: Users,
    title: "Create Rooms",
    description:
      "Set up your own party room and invite friends with a simple room code.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: Gamepad2,
    title: "Play Games",
    description:
      "Choose from a variety of fun games to play together in real-time.",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: MessageSquare,
    title: "Chat & Connect",
    description:
      "Stay connected with in-room chat and see who's online in real-time.",
    gradient: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-400",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Create private rooms or join public ones. Your data is always secure.",
    gradient: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-400",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "See game results, player status, and room activity as it happens.",
    gradient: "from-yellow-500/20 to-amber-500/20",
    iconColor: "text-yellow-400",
  },
  {
    icon: Heart,
    title: "Build Friendships",
    description:
      "Add friends, track your stats, and build lasting gaming connections.",
    gradient: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-400",
  },
];

export function LandingFeatures() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--tw-gradient-stops))] from-muted/50 via-transparent to-transparent" />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Section Header - Asymmetric */}
        <div className="max-w-4xl mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Features
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
            <span className="block">Everything you</span>
            <span className="block bg-[linear-gradient(135deg,var(--primary),var(--accent))] bg-clip-text text-transparent">
              need to party
            </span>
          </h2>
          <p className="text-xl text-muted-foreground/80 mt-6 max-w-2xl">
            Powerful features designed to make your virtual parties
            unforgettable
          </p>
        </div>

        {/* Features Grid - Unique Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Card */}
              <div
                className={`relative h-full p-8 rounded-3xl bg-background/40 backdrop-blur-xl border border-foreground/10 transition-all duration-500 ${
                  hoveredIndex === index
                    ? "scale-105 shadow-2xl border-foreground/20"
                    : "hover:scale-[1.02]"
                }`}
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-background/60 backdrop-blur-sm border border-foreground/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <feature.icon
                        className={`w-7 h-7 ${feature.iconColor} transition-transform duration-500 group-hover:rotate-12`}
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-foreground transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground/80 leading-relaxed group-hover:text-foreground/90 transition-colors">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative Element */}
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-linear-to-br from-primary/10 to-accent/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
