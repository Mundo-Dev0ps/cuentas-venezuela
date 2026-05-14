import type { Metadata } from "next";

// Centralized page-metadata builder. Per-page metadata exports call this
// to get a uniformly-shaped Metadata object (title, description, canonical,
// OG, Twitter). Root layout.tsx supplies the site-wide defaults — this
// only overrides what the page needs.

interface PageMetaInput {
  /** Short title — Next will apply the "%s · Cuentas Venezuela" template. */
  title: string;
  /** 130–160 chars ideal. Shown in SERP snippet + OG share preview. */
  description: string;
  /** Path starting with "/" — canonical + og:url. */
  path: string;
  /** OG type override (default "website"; use "article" for editorial). */
  type?: "website" | "article";
  /** Optional per-page OG image path; falls back to /opengraph-image. */
  image?: string;
}

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  image,
}: PageMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} · Cuentas Venezuela`,
      description,
      url: path,
      type,
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Cuentas Venezuela`,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
