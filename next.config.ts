import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Ignore ESLint errors during builds on Render
    ignoreDuringBuilds: true,
  },
  // Keep static export for deployment
  output: 'export',
};

export default nextConfig;
