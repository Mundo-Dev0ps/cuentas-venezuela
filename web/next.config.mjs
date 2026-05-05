/** @type {import('next').NextConfig} */
const MAPA_INTERNAL_URL = process.env.MAPA_INTERNAL_URL || "http://mapa-web:5173";

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  async rewrites() {
    return [
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
