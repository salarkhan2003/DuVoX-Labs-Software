import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint on build
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Skip TypeScript errors on build
  },
}

export default nextConfig
