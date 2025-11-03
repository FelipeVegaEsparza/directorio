import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  // Disable SSR for development to avoid hydration issues
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      ssr: false,
    },
  }),
};

export default nextConfig;
