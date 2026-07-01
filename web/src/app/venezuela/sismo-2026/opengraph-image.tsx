import { ImageResponse } from "next/og";
import { DAMAGE, SEISMIC_EVENTS, fmtNum } from "./data";

// Page-level OG image override for /venezuela/sismo-2026. Surfaces the
// headline figures (deaths + max magnitude) so social/SERP previews carry
// the data, not just the site name. nodejs runtime (OpenNext+Cloudflare).
export const alt =
  "Terremotos de Venezuela de 2026 — muertos, magnitud y daños";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const maxMag = Math.max(...SEISMIC_EVENTS.map((e) => e.magnitude));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #7f1d1d 100%)",
          color: "#f8fafc",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#fef2f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800,
              color: "#7f1d1d",
            }}
          >
            CV
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, opacity: 0.9 }}>
            cuentasvenezuela.org
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#fca5a5",
            }}
          >
            Emergencia · 24 de junio de 2026
          </div>
          <div
            style={{
              fontSize: 66,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
            }}
          >
            Terremotos de Venezuela de 2026
          </div>
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          <Stat value={`${maxMag}`} label="Magnitud Mw" />
          <Stat
            value={`${fmtNum(DAMAGE.dead)}+`}
            label="Muertos"
          />
          <Stat
            value={`${fmtNum(DAMAGE.injured)}+`}
            label="Heridos"
          />
          <Stat value="$4,7–8,7 MM" label="Daño (PNUD)" />
        </div>
      </div>
    ),
    size,
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: "16px 24px",
        borderRadius: 14,
        background: "rgba(248,250,252,0.06)",
        border: "1px solid rgba(248,250,252,0.12)",
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 800, color: "#fecaca" }}>
        {value}
      </div>
      <div style={{ fontSize: 18, color: "#94a3b8" }}>{label}</div>
    </div>
  );
}
