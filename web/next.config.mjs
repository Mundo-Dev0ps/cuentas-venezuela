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
  // Strip the `x-powered-by: Next.js` header — info disclosure, no upside.
  poweredByHeader: false,
  // typedRoutes is disabled until all callsites use Route<'/path'> typing.
  // Pre-existing usages pass plain strings to <Link href> and break the
  // production build under strict mode. Re-enable after a sweep.
  typedRoutes: false,
  // react-router-dom v7 + maplibre-gl get bundled into Next's shared chunks
  // and trip the App-Router-can't-use-Html guard during /404 prerender.
  // Treat them as external server components so prerender doesn't touch
  // their evaluation paths.
  serverExternalPackages: ["react-router-dom", "maplibre-gl", "@deck.gl/core", "@deck.gl/layers", "@deck.gl/react"],
  images: {
    // Cloudflare Workers cannot run the Next image optimizer (sharp / WASM
    // path is not available). Serve images as-is; size them server-side at
    // upload time, or proxy via Cloudflare Images later.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "cuentasvenezuela.org" },
    ],
  },
  async rewrites() {
    return [
      // Same-origin proxy from Next to the Hono backend so client code can use
      // /api/obras without CORS or hardcoded ports. In prod (Cloudflare Pages
      // serving Next + Fly hosting api), set INTERNAL_API_URL to the public
      // api hostname (e.g. https://api.cuentasvenezuela.org).
      {
        source: "/api/:path*",
        destination: `${API_INTERNAL_URL}/api/:path*`,
      },
    ];
  },
  async redirects() {
    // Bare-prefix aliases that Google or external backlinks discovered.
    // Permanent so GSC drops the 404 entries and consolidates link equity
    // on the canonical paths.
    return [
      {
        source: "/reportar",
        destination: "/mapa-del-olvido/reportar",
        permanent: true,
      },
      {
        source: "/metodologia",
        destination: "/datos-chile/metodologia",
        permanent: true,
      },
      {
        source: "/sobre",
        destination: "/mapa-del-olvido/sobre",
        permanent: true,
      },
      {
        source: "/obras",
        destination: "/mapa-del-olvido/obras",
        permanent: true,
      },
      {
        source: "/obras/:id",
        destination: "/mapa-del-olvido/obras/:id",
        permanent: true,
      },
      {
        source: "/mapa-del-olvido/obra/:id",
        destination: "/mapa-del-olvido/obras/:id",
        permanent: true,
      },
      {
        source: "/obra/:id",
        destination: "/mapa-del-olvido/obras/:id",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
