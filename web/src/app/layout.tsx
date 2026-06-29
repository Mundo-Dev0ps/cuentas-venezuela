import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cuentasvenezuela.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Cuentas Venezuela — datos abiertos sobre Venezuela y su diáspora",
    template: "%s · Cuentas Venezuela",
  },
  description:
    "Plataforma ciudadana con datos oficiales, comparables y citados sobre Venezuela: economía, salud, derechos humanos, inseguridad, diáspora y obras públicas paralizadas.",
  keywords: [
    "Venezuela",
    "datos abiertos",
    "diáspora venezolana",
    "Mapa del Olvido",
    "obras paralizadas",
    "derechos humanos Venezuela",
    "economía Venezuela",
    "riesgo país Venezuela",
    "migración venezolana",
  ],
  authors: [{ name: "Cuentas Venezuela" }],
  creator: "Cuentas Venezuela",
  publisher: "Cuentas Venezuela",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_VE",
    url: SITE_URL,
    siteName: "Cuentas Venezuela",
    title:
      "Cuentas Venezuela — datos abiertos sobre Venezuela y su diáspora",
    description:
      "Plataforma ciudadana con datos oficiales, comparables y citados sobre Venezuela: economía, salud, DDHH, inseguridad, diáspora y obras públicas paralizadas.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Cuentas Venezuela",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cuentas Venezuela",
    description:
      "Datos oficiales, comparables y citados sobre Venezuela y su diáspora.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Set the Google Search Console verification token here once issued.
  // verification: { google: "google-site-verification=XXXX" },
  category: "data",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cuentas Venezuela",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  sameAs: ["https://github.com/Mundo-Dev0ps/cuentas-venezuela"],
  description:
    "Plataforma ciudadana de datos abiertos sobre Venezuela y su diáspora.",
  // E-E-A-T: declare expertise area + sourcing posture for YMYL topics
  // (deaths, politics, human rights), where Google weighs trust heavily.
  knowsAbout: [
    "Venezuela",
    "diáspora venezolana",
    "derechos humanos en Venezuela",
    "economía de Venezuela",
    "migración venezolana",
    "datos abiertos",
  ],
  areaServed: "VE",
  knowsLanguage: "es",
  publishingPrinciples: `${SITE_URL}/fuentes`,
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Cuentas Venezuela",
  url: SITE_URL,
  inLanguage: "es",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/fuentes?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          // JSON-LD: schema.org Organization. Helps Google understand the
          // publisher entity and surface it in Knowledge Graph cards.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_JSONLD),
          }}
        />
        <script
          type="application/ld+json"
          // JSON-LD: schema.org WebSite. Enables Sitelinks Search Box.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(WEBSITE_JSONLD),
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col text-slate-100 antialiased animate-page-fade">
        <SiteHeader />
        <div className="flex-1 animate-page-rise">{children}</div>
        <SiteFooter />
        {/*
          Plausible — privacy-first analytics, GDPR-friendly, no cookies.
          The domain attribute MUST match the host you serve from.
          Already whitelisted in CSP (script-src + connect-src).
        */}
        <Script
          src="https://plausible.io/js/script.js"
          data-domain="cuentasvenezuela.org"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
