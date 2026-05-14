import MapaLoader from "@/components/mapa-loader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Mapa del Olvido — obras paralizadas en Venezuela",
  description:
    "Mapa interactivo de obras públicas paralizadas, críticas e inoperativas en Venezuela (1976-2024). Datos verificados, reportes ciudadanos y filtros por estado.",
  path: "/mapa-del-olvido",
});

export default function MapaPage() {
  return <MapaLoader />;
}
