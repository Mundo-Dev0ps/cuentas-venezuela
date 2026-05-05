"use client";

import { useEffect, useMemo, useState } from "react";
import Map, { NavigationControl } from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer, GeoJsonLayer } from "@deck.gl/layers";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";

import { MOCK_OBRAS, mockStats } from "@/lib/obras-mock";
import type { Obra, ObraStatus, ObraTipo } from "@/lib/obras-types";

const INITIAL_VIEW = {
  longitude: -66.5,
  latitude: 8.0,
  zoom: 5.4,
  pitch: 0,
  bearing: 0,
};

const STATUS_COLOR: Record<ObraStatus, [number, number, number]> = {
  inaugurada: [16, 185, 129],
  abandonada: [239, 68, 68],
  parcial: [245, 158, 11],
  en_construccion: [59, 130, 246],
};

const STATUS_LABEL: Record<ObraStatus, string> = {
  inaugurada: "Inaugurada",
  abandonada: "Abandonada",
  parcial: "Parcial",
  en_construccion: "En construcción",
};

const TIPO_LABEL: Record<ObraTipo, string> = {
  vialidad: "Vialidad",
  salud: "Salud",
  educacion: "Educación",
  vivienda: "Vivienda",
  agua: "Agua",
  energia: "Energía",
  otros: "Otros",
};

interface Filters {
  status: ObraStatus | null;
  tipo: ObraTipo | null;
  estado: string | null;
  yearRange: [number, number];
}

const DEFAULT_FILTERS: Filters = {
  status: null,
  tipo: null,
  estado: null,
  yearRange: [2000, 2025],
};

export function MapaDelOlvido() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<Obra | null>(null);
  const [boundary, setBoundary] = useState<unknown>(null);

  useEffect(() => {
    fetch("/data/venezuela.geojson")
      .then((r) => r.json())
      .then(setBoundary)
      .catch(() => setBoundary(null));
  }, []);

  const filtered = useMemo(() => filterObras(MOCK_OBRAS, filters), [filters]);
  const stats = useMemo(() => mockStats(), []);
  const allEstados = useMemo(
    () => Array.from(new Set(MOCK_OBRAS.map((o) => o.estado))).sort(),
    [],
  );

  const layers = [
    boundary &&
      new GeoJsonLayer({
        id: "venezuela-boundary",
        data: boundary as any,
        stroked: true,
        filled: true,
        getFillColor: [40, 60, 90, 30],
        getLineColor: [120, 180, 220, 200],
        lineWidthMinPixels: 1,
      }),
    new ScatterplotLayer<Obra>({
      id: "obras-scatter",
      data: filtered.filter((o) => o.lat != null && o.lon != null),
      pickable: true,
      getPosition: (o) => [o.lon!, o.lat!],
      getRadius: (o) =>
        o.monto_usd ? Math.max(8, Math.min(40, Math.log10(o.monto_usd) * 4)) : 8,
      radiusUnits: "pixels",
      getFillColor: (o) => [...STATUS_COLOR[o.status], 220],
      getLineColor: [255, 255, 255, 200],
      lineWidthMinPixels: 1,
      stroked: true,
      onClick: (info) => setSelected((info.object as Obra) ?? null),
    }),
  ].filter(Boolean) as any[];

  return (
    <div className="relative h-[calc(100dvh-4rem)]">
      <div className="absolute inset-0">
        <DeckGL
          initialViewState={INITIAL_VIEW}
          controller
          layers={layers}
          getCursor={({ isHovering }) => (isHovering ? "pointer" : "grab")}
        >
          <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json">
            <NavigationControl position="top-left" />
          </Map>
        </DeckGL>
      </div>

      <HeroPanel stats={stats} filtered={filtered.length} />
      <FiltersPanel
        filters={filters}
        setFilters={setFilters}
        estados={allEstados}
      />
      <Legend />
      {selected && (
        <ObraDrawer obra={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function filterObras(obras: Obra[], f: Filters): Obra[] {
  return obras.filter((o) => {
    if (f.status && o.status !== f.status) return false;
    if (f.tipo && o.tipo !== f.tipo) return false;
    if (f.estado && o.estado !== f.estado) return false;
    const y = o.anio_fin ?? o.anio_inicio ?? 0;
    if (y && (y < f.yearRange[0] || y > f.yearRange[1])) return false;
    return true;
  });
}

function HeroPanel({
  stats,
  filtered,
}: {
  stats: ReturnType<typeof mockStats>;
  filtered: number;
}) {
  const usd = (n: number) =>
    n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  return (
    <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-xs rounded-lg bg-white/95 p-4 shadow-lg backdrop-blur dark:bg-neutral-900/95">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
        Mapa del Olvido
      </h2>
      <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-2xl font-bold tabular-nums" data-testid="hero-total">
            {stats.total_count}
          </div>
          <div className="text-xs text-neutral-500">obras totales</div>
        </div>
        <div>
          <div className="text-2xl font-bold tabular-nums">{filtered}</div>
          <div className="text-xs text-neutral-500">en vista</div>
        </div>
        <div className="col-span-2 border-t border-neutral-200 pt-2 dark:border-neutral-800">
          <div className="text-sm tabular-nums">
            {usd(stats.total_monto_usd)}
          </div>
          <div className="text-xs text-neutral-500">monto registrado</div>
        </div>
      </div>
    </div>
  );
}

function FiltersPanel({
  filters,
  setFilters,
  estados,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  estados: string[];
}) {
  return (
    <div className="absolute right-4 top-4 z-10 w-72 rounded-lg bg-white/95 p-4 shadow-lg backdrop-blur dark:bg-neutral-900/95">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        Filtros
      </h3>
      <div className="space-y-3 text-sm">
        <Select
          label="Status"
          value={filters.status ?? ""}
          onChange={(v) =>
            setFilters((f) => ({ ...f, status: (v || null) as ObraStatus | null }))
          }
          options={[
            ["", "Todos"],
            ...Object.entries(STATUS_LABEL),
          ]}
        />
        <Select
          label="Tipo"
          value={filters.tipo ?? ""}
          onChange={(v) =>
            setFilters((f) => ({ ...f, tipo: (v || null) as ObraTipo | null }))
          }
          options={[
            ["", "Todos"],
            ...Object.entries(TIPO_LABEL),
          ]}
        />
        <Select
          label="Estado"
          value={filters.estado ?? ""}
          onChange={(v) => setFilters((f) => ({ ...f, estado: v || null }))}
          options={[["", "Todos"], ...estados.map((e) => [e, e] as [string, string])]}
        />
        <div>
          <label className="block text-xs text-neutral-500">
            Año {filters.yearRange[0]} – {filters.yearRange[1]}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={2000}
              max={2025}
              value={filters.yearRange[0]}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  yearRange: [Number(e.target.value), f.yearRange[1]],
                }))
              }
              className="w-full rounded border border-neutral-200 px-2 py-1 dark:border-neutral-700 dark:bg-neutral-800"
            />
            <input
              type="number"
              min={2000}
              max={2025}
              value={filters.yearRange[1]}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  yearRange: [f.yearRange[0], Number(e.target.value)],
                }))
              }
              className="w-full rounded border border-neutral-200 px-2 py-1 dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
        </div>
        <button
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="w-full rounded bg-neutral-100 py-1.5 text-xs hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block">
      <span className="block text-xs text-neutral-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded border border-neutral-200 px-2 py-1 dark:border-neutral-700 dark:bg-neutral-800"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

function Legend() {
  return (
    <div className="absolute bottom-6 left-4 z-10 rounded-lg bg-white/95 p-3 text-xs shadow-lg backdrop-blur dark:bg-neutral-900/95">
      <div className="mb-1 font-semibold uppercase tracking-wide text-neutral-500">
        Status
      </div>
      <ul className="space-y-1">
        {(Object.keys(STATUS_COLOR) as ObraStatus[]).map((s) => {
          const [r, g, b] = STATUS_COLOR[s];
          return (
            <li key={s} className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ background: `rgb(${r},${g},${b})` }}
              />
              <span>{STATUS_LABEL[s]}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ObraDrawer({ obra, onClose }: { obra: Obra; onClose: () => void }) {
  const usd = (n?: number) =>
    n != null
      ? n.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        })
      : "—";

  return (
    <aside className="absolute bottom-4 right-4 top-44 z-10 w-96 overflow-y-auto rounded-lg bg-white/95 p-4 shadow-2xl backdrop-blur dark:bg-neutral-900/95">
      <button
        onClick={onClose}
        className="absolute right-3 top-3 rounded p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        aria-label="Cerrar"
      >
        ✕
      </button>
      <h3 className="pr-6 text-lg font-semibold">{obra.nombre}</h3>
      <dl className="mt-3 space-y-2 text-sm">
        <Row label="Estado" value={obra.estado} />
        <Row label="Status" value={STATUS_LABEL[obra.status]} />
        <Row label="Tipo" value={TIPO_LABEL[obra.tipo]} />
        <Row label="Monto" value={usd(obra.monto_usd)} />
        <Row
          label="Período"
          value={
            obra.anio_inicio
              ? `${obra.anio_inicio}${obra.anio_fin ? `–${obra.anio_fin}` : "–presente"}`
              : "—"
          }
        />
        {obra.fuente_url && (
          <div className="pt-2">
            <a
              href={obra.fuente_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Ver fuente →
            </a>
          </div>
        )}
        <div className="pt-2">
          <Link
            href={`/mapa-del-olvido/obra/${obra.slug}`}
            className="text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Página de la obra →
          </Link>
        </div>
      </dl>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-right tabular-nums">{value}</dd>
    </div>
  );
}
