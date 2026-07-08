import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const API_URL =
  process.env.INTERNAL_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://api:8000";

interface ObraSitemap {
  id: string;
  updated_at?: string;
}

async function fetchObrasForSitemap(): Promise<ObraSitemap[]> {
  try {
    const res = await fetch(`${API_URL}/api/obras`, {
      // Cache the sitemap data for an hour; revalidates per Next.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as Array<{ id: string }>;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Real last-modified date per route. Reporting `new Date()` for every page
// on every crawl is a noisy signal — Google learns the dates are
// meaningless and ignores them. These reflect the last substantive content
// change; bump a route's date when you actually edit that page.
const ROUTE_LASTMOD: Record<string, string> = {
  "": "2026-06-28",
  "/apoyar": "2026-05-11",
  "/fuentes": "2026-06-08",
  "/mapa-del-olvido": "2026-05-11",
  "/mapa-del-olvido/obras": "2026-05-11",
  "/mapa-del-olvido/sobre": "2026-05-11",
  "/mapa-del-olvido/metodologia": "2026-05-11",
  "/mapa-del-olvido/reportar": "2026-06-08",
  "/datos-chile": "2026-05-11",
  "/datos-chile/fuentes": "2026-05-11",
  "/datos-chile/indicadores": "2026-05-11",
  "/datos-chile/dashboards": "2026-05-11",
  "/datos-chile/dashboards/comparativa": "2026-05-11",
  "/datos-chile/dashboards/demografia": "2026-05-11",
  "/datos-chile/dashboards/pensiones": "2026-05-11",
  "/datos-chile/dashboards/tributario": "2026-05-11",
  "/datos-chile/metodologia": "2026-05-11",
  "/venezuela": "2026-07-07",
  "/venezuela/antes-despues": "2026-05-11",
  "/venezuela/economia": "2026-05-11",
  "/venezuela/inseguridad": "2026-06-08",
  "/venezuela/salud": "2026-05-11",
  "/venezuela/ddhh": "2026-06-08",
  "/venezuela/diaspora": "2026-05-11",
  "/venezuela/corrupcion": "2026-05-11",
  "/venezuela/cronologia": "2026-05-11",
  "/venezuela/coyuntura": "2026-07-08",
  "/venezuela/esequibo": "2026-06-08",
  "/venezuela/sismo-2026": "2026-07-07",
  "/venezuela/puerta-giratoria": "2026-07-07",
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fallback = new Date();

  const staticRoutes = Object.entries(ROUTE_LASTMOD).map(([path, date]) => ({
    url: `${SITE}${path}`,
    lastModified: new Date(`${date}T00:00:00Z`),
  }));

  // Per-obra server-rendered detail pages at /mapa-del-olvido/obras/{id}.
  // The old singular /obra/{id} path was retired (it was a phantom URL
  // that only existed inside the SPA and never had an HTML page behind
  // it; submitting it to Google produced "soft 404" noise).
  const obras = await fetchObrasForSitemap();
  const obraEntries = obras.map((o) => ({
    url: `${SITE}/mapa-del-olvido/obras/${o.id}`,
    lastModified: o.updated_at ? new Date(o.updated_at) : fallback,
  }));

  return [...staticRoutes, ...obraEntries];
}
