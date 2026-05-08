"use client";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { MetodologiaPage } from "./components/Pages/MetodologiaPage";
import { SobrePage } from "./components/Pages/SobrePage";
import { ReportarPage } from "./components/Pages/ReportarPage";
import { LandingPage } from "./components/Pages/LandingPage";
import "maplibre-gl/dist/maplibre-gl.css";

const ROUTER_BASENAME = "/mapa-del-olvido";

function resolveBasename(): string {
  if (typeof window === "undefined") return ROUTER_BASENAME;
  return window.location.pathname.startsWith(ROUTER_BASENAME)
    ? ROUTER_BASENAME
    : "";
}

/**
 * MapaRoot mounts the original mapa-olvido SPA inside a Next.js client
 * component. The internal BrowserRouter handles sub-routes
 * (/obra/:id, /sobre, /metodologia, /reportar, /estado/:slug) under the
 * basename `/mapa-del-olvido`. The Next.js app shell (SiteHeader, layout)
 * sits above it.
 */
export default function MapaRoot() {
  return (
    <BrowserRouter basename={resolveBasename()}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/obra/:id" element={<App />} />
        <Route path="/estado/:slug" element={<App />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/metodologia" element={<MetodologiaPage />} />
        <Route path="/reportar" element={<ReportarPage />} />
        <Route path="/embed" element={<App />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
