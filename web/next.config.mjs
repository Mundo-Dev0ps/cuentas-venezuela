/** @type {import('next').NextConfig} */
const MAPA_INTERNAL_URL = process.env.MAPA_INTERNAL_URL || "http://mapa-web:5173";
const API_INTERNAL_URL = process.env.INTERNAL_API_URL || "http://api:8000";

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  async rewrites() {
    return [
      // Hono API: same-origin proxy so the mapa (and any client) can use /api/*
      // without CORS or hardcoded ports.
      {
        source: "/api/:path*",
        destination: `${API_INTERNAL_URL}/api/:path*`,
      },
      {
        source: "/mapa-del-olvido",
        destination: `${MAPA_INTERNAL_URL}/mapa-del-olvido/`,
      },
      {
        source: "/mapa-del-olvido/",
        destination: `${MAPA_INTERNAL_URL}/mapa-del-olvido/`,
      },
      {
        source: "/mapa-del-olvido/:path*",
        destination: `${MAPA_INTERNAL_URL}/mapa-del-olvido/:path*`,
      },
    ];
  },
  // Disable Next's default trailing-slash redirect so /mapa-del-olvido/ is forwarded
  // to the Vite mapa server intact.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
