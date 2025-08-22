const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false, // ✅ Enable ESLint during build
  },
  typescript: {
    ignoreBuildErrors: false, // ✅ Enable TypeScript errors on build
  },
}

export default nextConfig
