import type { MetadataRoute } from "next";
import { MOCK_OBRAS } from "@/lib/obras-mock";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = [
    "",
    "/mapa-del-olvido",
    "/mapa-del-olvido/sobre",
    "/mapa-del-olvido/metodologia",
    "/mapa-del-olvido/reportar",
    "/datos-chile",
    "/datos-chile/fuentes",
    "/datos-chile/indicadores",
    "/datos-chile/dashboards",
    "/datos-chile/metodologia",
  ].map((path) => ({ url: `${SITE}${path}`, lastModified }));

  const obras = MOCK_OBRAS.map((o) => ({
    url: `${SITE}/mapa-del-olvido/obra/${o.slug}`,
    lastModified,
  }));

  return [...staticRoutes, ...obras];
}
