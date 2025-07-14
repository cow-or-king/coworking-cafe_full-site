import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Configuration pour les pages qui ne peuvent pas être pré-rendues
  serverExternalPackages: ["react-pdf"],
};

export default nextConfig;
