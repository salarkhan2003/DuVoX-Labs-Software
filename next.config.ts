import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Removed output: 'export' so server functions (API routes) work
}

export default nextConfig
