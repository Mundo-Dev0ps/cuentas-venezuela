import { ImageResponse } from "next/og";

// Next 15 file-route convention: this file at /app/opengraph-image.tsx
// generates the default OG image at /opengraph-image. Individual pages
// can override by adding their own opengraph-image.tsx in their folder.

export const runtime = "edge";
export const alt = "Cuentas Venezuela — datos abiertos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
            "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #7f1d1d 100%)",
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
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              opacity: 0.9,
            }}
          >
            cuentasvenezuela.org
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Cuentas Venezuela
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: "#cbd5e1",
              lineHeight: 1.25,
              maxWidth: 980,
            }}
          >
            Datos oficiales, comparables y citados sobre Venezuela y su
            diáspora.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 32,
            fontSize: 22,
            color: "#94a3b8",
          }}
        >
          <span>Economía</span>
          <span>•</span>
          <span>DDHH</span>
          <span>•</span>
          <span>Salud</span>
          <span>•</span>
          <span>Diáspora</span>
          <span>•</span>
          <span>Mapa del Olvido</span>
        </div>
      </div>
    ),
    size,
  );
}
