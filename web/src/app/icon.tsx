import { ImageResponse } from "next/og";

// Next 15 file-route convention: app/icon.tsx generates /icon at runtime.
// Browser uses this as favicon. 32x32 is the standard tab-bar size.

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 18,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
          borderRadius: 6,
        }}
      >
        CV
      </div>
    ),
    size,
  );
}
