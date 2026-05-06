"use client";

import dynamic from "next/dynamic";

// deck.gl + maplibre touch WebGL APIs at module load. ssr:false ensures the
// bundle only loads on the client. Must live in a client component.
const MapaRoot = dynamic(() => import("@/mapa/MapaRoot"), { ssr: false });

export default function MapaLoader() {
  return <MapaRoot />;
}
