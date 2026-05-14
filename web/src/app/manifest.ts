import type { MetadataRoute } from "next";

// PWA manifest. Lets Android "Add to Home Screen" pin the site as an app.
// Next 15 picks this up automatically at /manifest.webmanifest.

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cuentas Venezuela",
    short_name: "CuentasVE",
    description:
      "Datos oficiales, comparables y citados sobre Venezuela y su diáspora.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#7f1d1d",
    lang: "es",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
