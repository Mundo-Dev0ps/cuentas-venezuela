import { useEffect } from 'react';
import type { ObraPublica } from '../types/obra';

const SITE = 'https://cuentas-claras-61114.web.app';
const SCRIPT_ID = 'mdo-jsonld';

function setJsonLd(obj: object | null): void {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (!obj) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.id = SCRIPT_ID;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(obj);
}

function setMeta(name: string, value: string | null, attr: 'name' | 'property' = 'name'): void {
  if (typeof document === 'undefined') return;
  const sel = `meta[${attr}="${name}"]`;
  let el = document.head.querySelector(sel) as HTMLMetaElement | null;
  if (!value) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = value;
}

function setTitle(t: string): void {
  if (typeof document !== 'undefined') document.title = t;
}

function setCanonical(href: string): void {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

export function useSeoHome(): void {
  useEffect(() => {
    setTitle('Mapa del Olvido — Obras públicas inconclusas en Venezuela');
    setCanonical(`${SITE}/mapa-del-olvido`);
    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'Mapa del Olvido',
      description: 'Registro abierto de obras públicas paralizadas, críticas e inoperativas en Venezuela.',
      url: `${SITE}/mapa-del-olvido`,
      keywords: ['Venezuela', 'transparencia', 'obras públicas', 'corrupción', 'paralizada'],
      license: 'https://creativecommons.org/licenses/by-sa/4.0/',
      creator: { '@type': 'Organization', name: 'Mapa del Olvido' },
      isAccessibleForFree: true,
      spatialCoverage: { '@type': 'Place', name: 'Venezuela' },
    });
  }, []);
}

export function useSeoObra(obra: ObraPublica | null): void {
  useEffect(() => {
    if (!obra) return;
    setTitle(`${obra.nombre} — Mapa del Olvido`);
    setCanonical(`${SITE}/mapa-del-olvido/obra/${obra.id}`);
    setMeta(
      'description',
      `${obra.nombre}: obra ${obra.estatus} en ${obra.estado_venezuela}, iniciada en ${obra.anio_inicio}.`
    );
    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: obra.nombre,
      description: `Obra pública ${obra.estatus} en ${obra.estado_venezuela} (Venezuela). Iniciada en ${obra.anio_inicio}. Categoría: ${obra.categoria}. Ente responsable: ${obra.ente_responsable}.`,
      address: {
        '@type': 'PostalAddress',
        addressRegion: obra.estado_venezuela,
        addressCountry: 'VE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: obra.coordenadas.lat,
        longitude: obra.coordenadas.lng,
      },
      url: `${SITE}/mapa-del-olvido/obra/${obra.id}`,
      sameAs: obra.fuente_url ? [obra.fuente_url] : undefined,
    });
    return () => {
      setJsonLd(null);
    };
  }, [obra]);
}

export function useSeoState(stateName: string | null): void {
  useEffect(() => {
    if (!stateName) return;
    setTitle(`Obras inconclusas en ${stateName} — Mapa del Olvido`);
    setMeta('description', `Listado de obras públicas paralizadas, críticas o inoperativas en ${stateName}, Venezuela.`);
    return () => {};
  }, [stateName]);
}
