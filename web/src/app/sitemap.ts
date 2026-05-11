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
    "/mapa-del-olvido",
    "/mapa-del-olvido/sobre",
    "/mapa-del-olvido/metodologia",
    "/mapa-del-olvido/reportar",
    "/datos-chile",
    "/datos-chile/fuentes",
    "/datos-chile/indicadores",
    "/datos-chile/dashboards",
    "/datos-chile/metodologia",
    "/venezuela",
    "/venezuela/antes-despues",
    "/venezuela/economia",
    "/venezuela/inseguridad",
    "/venezuela/salud",
    "/venezuela/ddhh",
    "/venezuela/diaspora",
  ].map((path) => ({ url: `${SITE}${path}`, lastModified }));

  const obras = await fetchObrasForSitemap();
  const obraEntries = obras.map((o) => ({
    url: `${SITE}/mapa-del-olvido/obra/${o.id}`,
    lastModified: o.updated_at ? new Date(o.updated_at) : lastModified,
  }));

  return [...staticRoutes, ...obraEntries];
}
