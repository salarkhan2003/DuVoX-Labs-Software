import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // This skips ESLint errors during the build (production only)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // If you already have other settings, keep them here
};

export default nextConfig;
