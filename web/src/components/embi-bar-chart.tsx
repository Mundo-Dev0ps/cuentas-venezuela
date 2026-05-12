"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface EmbiBarRow {
  country: string;
  countryName: string;
  valueBps: number;
  isFrozen: boolean;
  snapshotDate: string;
}

interface Props {
  data: EmbiBarRow[];
  height?: number;
  /** Optional cap (bps) — values above clip to this with truncation marker. */
  visualCap?: number;
}

const fmt = (v: number) =>
  v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`;

export function EmbiBarChart({ data, height = 480, visualCap = 2000 }: Props) {
  // Clip Venezuela's spike (~14620 bps) to keep other countries readable.
  // Keep raw value in tooltip + label.
  const cappedData = data.map((r) => ({
    ...r,
    displayValue: Math.min(r.valueBps, visualCap),
    rawValue: r.valueBps,
    label: r.isFrozen ? `${fmt(r.valueBps)} (congelado)` : fmt(r.valueBps),
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={cappedData}
        layout="vertical"
        margin={{ top: 8, right: 80, left: 0, bottom: 8 }}
      >
        <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
        <XAxis
          type="number"
          stroke="#94a3b8"
          tick={{ fontSize: 11 }}
          tickFormatter={fmt}
          domain={[0, visualCap]}
          label={{
            value: `Spread (bps) — eje recortado a ${fmt(visualCap)}`,
            position: "insideBottom",
            offset: -4,
            fill: "#64748b",
            fontSize: 11,
          }}
        />
        <YAxis
          dataKey="countryName"
          type="category"
          stroke="#94a3b8"
          width={120}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(15,23,42,0.95)",
            border: "1px solid rgba(51,65,85,0.6)",
            borderRadius: 8,
            color: "#e2e8f0",
            fontSize: 12,
          }}
          itemStyle={{ color: "#e2e8f0" }}
          formatter={(_v: number, _n, ctx) => {
            const r = ctx.payload as EmbiBarRow & { rawValue: number };
            return [
              `${r.rawValue.toLocaleString("es-CL")} bps${r.isFrozen ? " (congelado)" : ""}`,
              "Spread",
            ];
          }}
          labelFormatter={(name, ctx) => {
            const r = ctx?.[0]?.payload as EmbiBarRow | undefined;
            return r ? `${name} · ${r.snapshotDate}` : String(name);
          }}
        />
        <ReferenceLine
          x={300}
          stroke="#22c55e"
          strokeDasharray="3 3"
          label={{ value: "Bajo", position: "top", fill: "#22c55e", fontSize: 10 }}
        />
        <ReferenceLine
          x={1000}
          stroke="#f97316"
          strokeDasharray="3 3"
          label={{ value: "Alto", position: "top", fill: "#f97316", fontSize: 10 }}
        />
        <Bar
          dataKey="displayValue"
          radius={[0, 4, 4, 0]}
          isAnimationActive
          animationDuration={900}
        >
          {cappedData.map((r) => (
            <Cell
              key={r.country}
              fill={
                r.country === "VEN"
                  ? "#f43f5e"
                  : r.valueBps > 1000
                    ? "#fb923c"
                    : r.valueBps > 300
                      ? "#fde047"
                      : "#22d3ee"
              }
            />
          ))}
          <LabelList
            dataKey="label"
            position="right"
            fill="#cbd5e1"
            fontSize={11}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
