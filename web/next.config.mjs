/** @type {import('next').NextConfig} */
const API_INTERNAL_URL = process.env.INTERNAL_API_URL || "http://api:8000";

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  async rewrites() {
    return [
      // Same-origin proxy from Next to the Hono backend so client code can use
      // /api/obras without CORS or hardcoded ports.
      {
        source: "/api/:path*",
        destination: `${API_INTERNAL_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
