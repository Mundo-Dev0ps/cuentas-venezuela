"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface FreedomPoint {
  year: number;
  VEN?: number | null;
  CHL?: number | null;
  URY?: number | null;
}

interface Props {
  data: FreedomPoint[];
  height?: number;
}

export function FreedomTrendChart({ data, height = 320 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        {/* Bands: NF (0–35), PF (36–70), F (71–100) */}
        <ReferenceArea y1={0} y2={35} fill="#7f1d1d" fillOpacity={0.18} />
        <ReferenceArea y1={35} y2={70} fill="#a16207" fillOpacity={0.15} />
        <ReferenceArea y1={70} y2={100} fill="#166534" fillOpacity={0.15} />

        <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
        <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 12 }} />
        <YAxis
          domain={[0, 100]}
          stroke="#94a3b8"
          tick={{ fontSize: 12 }}
          label={{ value: "Score (0–100)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 11 }}
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
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
        <Line type="monotone" dataKey="VEN" name="Venezuela" stroke="#f43f5e" strokeWidth={2.5} dot={false} connectNulls />
        <Line type="monotone" dataKey="CHL" name="Chile" stroke="#22d3ee" strokeWidth={2} dot={false} connectNulls />
        <Line type="monotone" dataKey="URY" name="Uruguay" stroke="#a78bfa" strokeWidth={2} dot={false} connectNulls strokeDasharray="3 3" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
