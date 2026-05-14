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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticRoutes = [
    "",
    "/apoyar",
    "/fuentes",
    "/mapa-del-olvido",
    "/mapa-del-olvido/obras",
    "/mapa-del-olvido/sobre",
    "/mapa-del-olvido/metodologia",
    "/mapa-del-olvido/reportar",
    "/datos-chile",
    "/datos-chile/fuentes",
    "/datos-chile/indicadores",
    "/datos-chile/dashboards",
    "/datos-chile/dashboards/comparativa",
    "/datos-chile/dashboards/demografia",
    "/datos-chile/dashboards/pensiones",
    "/datos-chile/dashboards/tributario",
    "/datos-chile/metodologia",
    "/venezuela",
    "/venezuela/antes-despues",
    "/venezuela/economia",
    "/venezuela/inseguridad",
    "/venezuela/salud",
    "/venezuela/ddhh",
    "/venezuela/diaspora",
  ].map((path) => ({ url: `${SITE}${path}`, lastModified }));

  // Per-obra server-rendered detail pages at /mapa-del-olvido/obras/{id}.
  // The old singular /obra/{id} path was retired (it was a phantom URL
  // that only existed inside the SPA and never had an HTML page behind
  // it; submitting it to Google produced "soft 404" noise).
  const obras = await fetchObrasForSitemap();
  const obraEntries = obras.map((o) => ({
    url: `${SITE}/mapa-del-olvido/obras/${o.id}`,
    lastModified: o.updated_at ? new Date(o.updated_at) : lastModified,
  }));

  return [...staticRoutes, ...obraEntries];
}
