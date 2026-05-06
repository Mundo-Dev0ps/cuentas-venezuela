"use client";

import dynamic from "next/dynamic";
import type { MapRow } from "./chile-map";

const ChileMap = dynamic(
  () => import("./chile-map").then((m) => m.ChileMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] w-full items-center justify-center rounded-xl border border-slate-700 text-sm text-slate-400 md:h-[520px] dark:border-neutral-800">
        Cargando mapa…
      </div>
    ),
  },
);

export function ChileMapLoader({ data }: { data: MapRow[] }) {
  return <ChileMap data={data} />;
}
