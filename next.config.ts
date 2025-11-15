// next.config.ts
import type { NextConfig } from "next";
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      "@tabler/icons-react",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(new PrismaPlugin());
    }
    return config;
  },
  turbopack: {
    resolveAlias: {
      "@/generated/prisma": "./src/generated/prisma",
    },
  },
};

export default nextConfig;