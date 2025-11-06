// next.config.ts
import type { NextConfig } from "next";
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
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