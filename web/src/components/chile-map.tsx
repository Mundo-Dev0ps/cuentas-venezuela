"use client";

import { useMemo } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { REGION_BY_CODE } from "@/lib/regions";

export interface MapRow {
  region_code: string;
  stock_legal: number;
}

export function ChileMap({ data }: { data: MapRow[] }) {
  const max = useMemo(
    () => Math.max(1, ...data.map((d) => d.stock_legal)),
    [data],
  );

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-xl border border-neutral-200 md:h-[520px] dark:border-neutral-800">
      <MapContainer
        center={[-37, -71]}
        zoom={4}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.map((row) => {
          const meta = REGION_BY_CODE[row.region_code];
          if (!meta) return null;
          const radius = 6 + Math.sqrt(row.stock_legal / max) * 38;
          return (
            <CircleMarker
              key={row.region_code}
              center={[meta.lat, meta.lng]}
              radius={radius}
              pathOptions={{
                color: "#059669",
                fillColor: "#10b981",
                fillOpacity: 0.55,
                weight: 1,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{meta.name}</div>
                  <div>
                    Stock legal:{" "}
                    {row.stock_legal.toLocaleString("es-CL")}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
