import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
};

export default nextConfig;
