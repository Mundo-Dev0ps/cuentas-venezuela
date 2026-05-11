/** @type {import('next').NextConfig} */
const API_INTERNAL_URL = process.env.INTERNAL_API_URL || "http://api:8000";
const isProd = process.env.NODE_ENV === "production";

// `unsafe-eval` is required by Next.js dev HMR and turbopack; drop in prod.
const SCRIPT_SRC = [
  "'self'",
  "'unsafe-inline'",
  ...(isProd ? [] : ["'unsafe-eval'"]),
  "https://plausible.io",
];

// connect-src: APIs the browser may call.
// (Cloudflare Workers Observability collects errors server-side; no
// browser-side error tracker is wired — keeps zero 3rd-party calls.)
const CONNECT_SRC = [
  "'self'",
  "data:",
  "blob:",
  "https://*.cartocdn.com",
  "https://basemaps.cartocdn.com",
  "https://nominatim.openstreetmap.org",
  "https://plausible.io",
  "https://api.web3forms.com",
];

const SECURITY_HEADERS = [
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src ${SCRIPT_SRC.join(" ")}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      `connect-src ${CONNECT_SRC.join(" ")}`,
      "worker-src 'self' blob:",
      "frame-src 'self' https://ko-fi.com https://*.ko-fi.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  images: {
    // Cloudflare Workers cannot run the Next image optimizer (sharp / WASM
    // path is not available). Serve images as-is; size them server-side at
    // upload time, or proxy via Cloudflare Images later.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "cuentasvenezuela.com" },
    ],
  },
  async rewrites() {
    return [
      // Same-origin proxy from Next to the Hono backend so client code can use
      // /api/obras without CORS or hardcoded ports. In prod (Cloudflare Pages
      // serving Next + Fly hosting api), set INTERNAL_API_URL to the public
      // api hostname (e.g. https://api.cuentasvenezuela.com).
      {
        source: "/api/:path*",
        destination: `${API_INTERNAL_URL}/api/:path*`,
      },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
