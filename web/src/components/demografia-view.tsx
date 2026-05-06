"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardDescription, CardTitle } from "@/components/card";
import { Stat } from "@/components/stat";
import { SourcePill } from "@/components/source-pill";
import { ShareButton } from "@/components/share-button";
import { StockChart, type StockPoint } from "@/components/stock-chart";
import { RegionBarChart } from "@/components/region-bar-chart";
import { ChileMapLoader } from "@/components/chile-map-loader";
import type { StockRegionRow } from "@/lib/api";

export function DemografiaView({ rows }: { rows: StockRegionRow[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const years = useMemo(
    () => Array.from(new Set(rows.map((r) => r.year))).sort(),
    [rows],
  );
  const allRegions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of rows) seen.set(r.region_code, r.region);
    return Array.from(seen.entries())
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  }, [rows]);

  const initialYear = (() => {
    const raw = searchParams.get("year");
    const parsed = raw ? Number(raw) : NaN;
    return years.includes(parsed) ? parsed : (years.at(-1) ?? 0);
  })();
  const initialExcluded = (() => {
    const raw = searchParams.get("exclude");
    if (!raw) return new Set<string>();
    const codes = raw.split(",").filter(Boolean);
    const valid = new Set(allRegions.map((r) => r.code));
    return new Set(codes.filter((c) => valid.has(c)));
  })();

  const [year, setYear] = useState<number>(initialYear);
  const [excluded, setExcluded] = useState<Set<string>>(initialExcluded);

  const syncUrl = useCallback(
    (nextYear: number, nextExcluded: Set<string>) => {
      const params = new URLSearchParams();
      if (nextYear !== years.at(-1)) params.set("year", String(nextYear));
      if (nextExcluded.size > 0) {
        params.set("exclude", Array.from(nextExcluded).sort().join(","));
      }
      const qs = params.toString();
      const path = qs
        ? `/datos-chile/dashboards/demografia?${qs}`
        : "/datos-chile/dashboards/demografia";
      router.replace(path, { scroll: false });
    },
    [router, years],
  );

  useEffect(() => {
    syncUrl(year, excluded);
  }, [year, excluded, syncUrl]);

  function toggleRegion(code: string) {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  function clearFilters() {
    setExcluded(new Set());
  }

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) => r.year === year && !excluded.has(r.region_code),
      ),
    [rows, year, excluded],
  );

  const filteredAllYears = useMemo(
    () => rows.filter((r) => !excluded.has(r.region_code)),
    [rows, excluded],
  );

  const stockByYear: StockPoint[] = useMemo(
    () =>
      years.map((y) => {
        const total = filteredAllYears
          .filter((r) => r.year === y)
          .reduce((acc, r) => acc + r.stock_legal, 0);
        return {
          year: y,
          legal: total,
          estimado_total: Math.round(total * 1.5),
        };
      }),
    [years, filteredAllYears],
  );

  const ranked = useMemo(
    () => [...filtered].sort((a, b) => b.stock_legal - a.stock_legal),
    [filtered],
  );

  const totalLatest = ranked.reduce((a, r) => a + r.stock_legal, 0);
  const top1 = ranked[0];

  return (
    <>
      <section className="mt-8 flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end">
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-400">
            Año
          </label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wider text-slate-400">
            Regiones (click para alternar)
          </div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {allRegions.map(({ code, name }) => {
              const active = !excluded.has(code);
              return (
                <button
                  key={code}
                  onClick={() => toggleRegion(code)}
                  className={
                    active
                      ? "rounded-full border border-orange-400 bg-orange-400 px-2.5 py-0.5 text-xs text-white hover:bg-orange-500"
                      : "rounded-full border border-slate-700 px-2.5 py-0.5 text-xs text-slate-400 hover:bg-slate-800 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  }
                >
                  {name}
                </button>
              );
            })}
            {excluded.size > 0 ? (
              <button
                onClick={clearFilters}
                className="ml-2 text-xs text-slate-400 underline hover:text-slate-100 dark:hover:text-white"
              >
                limpiar filtro
              </button>
            ) : null}
          </div>
        </div>
        <div className="md:self-end">
          <ShareButton label="Copiar enlace" />
        </div>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat
          label={`Stock legal ${year}`}
          value={totalLatest.toLocaleString("es-CL")}
          hint={
            excluded.size > 0
              ? `excluyendo ${excluded.size} región(es)`
              : "suma regiones"
          }
        />
        <Stat
          label="Región líder"
          value={top1?.region ?? "—"}
          hint={`${top1 ? Math.round((top1.stock_legal / totalLatest) * 100) : 0}% del total`}
        />
        <Stat
          label="Regiones con datos"
          value={`${ranked.length}/16`}
          hint="cobertura DPA"
        />
        <Stat
          label="Estimado total"
          value={`${Math.round(totalLatest * 1.5).toLocaleString("es-CL")}`}
          hint="incluye irregulares"
        />
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-baseline justify-between">
            <div>
              <CardTitle>
                Serie nacional {years.at(0)}-{years.at(-1)}
              </CardTitle>
              <CardDescription>
                Stock legal vs estimado total (legal × 1.5).
              </CardDescription>
            </div>
            <SourcePill name="SERMIG + SJM" url="https://serviciomigraciones.cl" />
          </div>
          <div className="mt-6">
            <StockChart data={stockByYear} />
          </div>
        </Card>

        <Card>
          <div className="flex items-baseline justify-between">
            <div>
              <CardTitle>Distribución regional {year}</CardTitle>
              <CardDescription>
                Stock legal vigente por región seleccionada.
              </CardDescription>
            </div>
            <SourcePill name="SERMIG" url="https://serviciomigraciones.cl" />
          </div>
          <div className="mt-6">
            <RegionBarChart
              data={ranked.map((r) => ({
                region: r.region,
                stock_legal: r.stock_legal,
              }))}
            />
          </div>
        </Card>
      </section>

      <section className="mt-8">
        <Card>
          <div className="flex items-baseline justify-between">
            <div>
              <CardTitle>Mapa nacional · {year}</CardTitle>
              <CardDescription>
                Tamaño del círculo proporcional al stock legal por región.
              </CardDescription>
            </div>
            <SourcePill
              name="OpenStreetMap + SERMIG"
              url="https://www.openstreetmap.org/copyright"
            />
          </div>
          <div className="mt-6">
            <ChileMapLoader
              data={ranked.map((r) => ({
                region_code: r.region_code,
                stock_legal: r.stock_legal,
              }))}
            />
          </div>
        </Card>
      </section>
    </>
  );
}
