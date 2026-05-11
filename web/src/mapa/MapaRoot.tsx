"use client";

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
 * Strip any duplicate "/mapa-del-olvido/mapa-del-olvido/..." prefix that an
 * older build may have produced before navigate() paths were corrected.
 * Runs once on mount to repair stale URLs without losing query/hash.
 */
function useCleanDuplicatePrefix(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") {
      setReady(true);
      return;
    }
    const dup = `${ROUTER_BASENAME}${ROUTER_BASENAME}`;
    const { pathname, search, hash } = window.location;
    if (pathname.startsWith(dup)) {
      const clean = pathname.replace(dup, ROUTER_BASENAME);
      window.history.replaceState(null, "", `${clean}${search}${hash}`);
    }
    setReady(true);
  }, []);
  return ready;
}

export default function MapaRoot() {
  const ready = useCleanDuplicatePrefix();
  if (!ready) return null;

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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
