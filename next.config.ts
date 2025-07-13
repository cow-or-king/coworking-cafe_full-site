import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Configuration pour les pages qui ne peuvent pas être pré-rendues
  experimental: {
    serverComponentsExternalPackages: ["react-pdf"],
  },
};

export default nextConfig;
