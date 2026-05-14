import { ImageResponse } from "next/og";

// iOS home-screen icon. 180x180 is the canonical size.
// Default nodejs runtime — OpenNext+Cloudflare bundling rejects edge.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#7f1d1d",
          color: "#fef2f2",
          fontSize: 96,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        CV
      </div>
    ),
    size,
  );
}
