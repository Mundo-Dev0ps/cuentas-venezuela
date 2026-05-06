import { MapContainer } from './components/Map/MapContainer';
import { useObras } from './hooks/useObras';
import { useMapZoom } from './hooks/useMapZoom';
import { buildScatterLayers } from './components/Map/ScatterLayer';
import { buildHighlightLayers } from './components/Map/HighlightLayer';
import { buildChoroplethLayer } from './components/Map/ChoroplethLayer';
import { buildClusterLayers } from './components/Map/ClusterLayer';
import { buildCapitalLayers } from './components/Map/CapitalLayer';
import { MapModeToggle } from './components/Map/MapModeToggle';
import { useVenezuelaBoundary } from './hooks/useVenezuelaBoundary';
import { useVenezuelaStates } from './hooks/useVenezuelaStates';
import { TimeSlider } from './components/TimeSlider/TimeSlider';
import { SideDrawer } from './components/SideDrawer/SideDrawer';
import { Legend } from './components/Legend/Legend';
import { HeroStats } from './components/HeroStats/HeroStats';
import { FiltersBar } from './components/FiltersBar/FiltersBar';
import { Onboarding } from './components/Onboarding/Onboarding';
import { MapSkeleton } from './components/UI/Skeleton';
import { MOCK_OBRAS } from './mocks/obras.mock';
import type { ObraPublica, Estatus } from './types/obra';
import type { PickingInfo } from '@deck.gl/core';
import { STATUS_HEX } from './constants/colors';
import { useMapPulse } from './hooks/useMapPulse';
import { readUrlState, useUrlSync } from './hooks/useUrlSync';
import { useSeoHome, useSeoObra, useSeoState } from './lib/seo';
import { toSlug, matchesSlug } from './lib/slug';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useMemo, useCallback, useEffect } from 'react';

const DEFAULT_URL_STATE = {
  yearRange: [1999, 2026] as [number, number],
  selectedState: null,
  search: '',
  activeCategorias: new Set<string>(),
  activeEstatus: new Set<Estatus>(),
};

const TOOLTIP_STYLE: Record<string, string> = {
  backgroundColor: 'rgba(3,8,30,0.96)',
  color: '#00e5ff',
  fontSize: '13px',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid rgba(0,200,255,0.3)',
  backdropFilter: 'blur(8px)',
  pointerEvents: 'none',
  maxWidth: '220px',
  lineHeight: '1.5',
};

const STATUS_LABEL: Record<string, string> = {
  paralizada: 'Paralizada',
  critica: 'Crítica',
  inoperativa: 'Inoperativa',
};

interface StateFeatureCollection {
  features: { properties: Record<string, string> }[];
}

function findStateBySlug(states: object | null, slug: string): string | null {
  if (!states) return null;
  const col = states as StateFeatureCollection;
  for (const f of col.features) {
    const name = f.properties.shapeName ?? f.properties.name ?? '';
    if (name && matchesSlug(name, slug)) return name;
  }
  return null;
}

export default function App() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isEmbed = useMemo(
    () => new URLSearchParams(location.search).get('embed') === '1',
    [location.search],
  );

  const initial = useMemo(() => readUrlState(DEFAULT_URL_STATE), []);

  const { filteredObras, loading, yearRange, setYearRange } = useObras(initial.yearRange);
  const { zoom, handleZoomChange } = useMapZoom();
  const [selectedObra, setSelectedObra] = useState<ObraPublica | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(initial.selectedState);
  const [search, setSearch] = useState(initial.search);
  const [activeCategorias, setActiveCategorias] = useState<Set<string>>(initial.activeCategorias);
  const [activeEstatus, setActiveEstatus] = useState<Set<Estatus>>(initial.activeEstatus);
  const [scatterOpacity, setScatterOpacity] = useState(0);

  useUrlSync(
    { yearRange, selectedState, search, activeCategorias, activeEstatus },
    DEFAULT_URL_STATE,
  );

  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (new URLSearchParams(window.location.search).get('embed') === '1') return false;
    return !window.localStorage.getItem('mdo-onboarded');
  });
  const [choroplethMode, setChoroplethMode] = useState(false);
  const pulseExpanded = useMapPulse();

  useSeoHome();
  useSeoObra(selectedObra);
  useSeoState(selectedState);

  const boundary = useVenezuelaBoundary();
  const states = useVenezuelaStates();
  const yearObras = filteredObras.length > 0 ? filteredObras : MOCK_OBRAS;

  // Resolve /obra/:id and /estado/:slug from path
  useEffect(() => {
    if (params.id) {
      const o = yearObras.find(x => x.id === params.id);
      if (o) {
        setSelectedObra(o);
        return;
      }
    }
    if (params.slug && states) {
      const name = findStateBySlug(states, params.slug);
      if (name) {
        setSelectedState(name);
        setSelectedObra(null);
      }
    }
  }, [params.id, params.slug, yearObras, states]);

  // Stagger fade-in on data load
  useEffect(() => {
    if (loading) return;
    setScatterOpacity(0);
    const id = window.setTimeout(() => setScatterOpacity(1), 60);
    return () => window.clearTimeout(id);
  }, [loading]);

  const baseObras = useMemo(() => {
    const q = search.trim().toLowerCase();
    return yearObras.filter(o => {
      if (activeCategorias.size && !activeCategorias.has(o.categoria)) return false;
      if (activeEstatus.size && !activeEstatus.has(o.estatus)) return false;
      if (q && !o.nombre.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [yearObras, search, activeCategorias, activeEstatus]);

  const obrasInState = useMemo(
    () => (selectedState ? baseObras.filter(o => o.estado_venezuela === selectedState) : []),
    [baseObras, selectedState],
  );
  const visibleObras = selectedState ? obrasInState : baseObras;

  const toggleCategoria = useCallback((c: string) => {
    setActiveCategorias(prev => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c); else next.add(c);
      return next;
    });
  }, []);
  const toggleEstatus = useCallback((e: Estatus) => {
    setActiveEstatus(prev => {
      const next = new Set(prev);
      if (next.has(e)) next.delete(e); else next.add(e);
      return next;
    });
  }, []);
  const clearAllFilters = useCallback(() => {
    setSearch('');
    setActiveCategorias(new Set());
    setActiveEstatus(new Set());
  }, []);

  const MAP_BASE = '/mapa-del-olvido';

  const handleStateClick = useCallback((name: string | null) => {
    setSelectedState(name);
    setSelectedObra(null);
    if (name) navigate(`${MAP_BASE}/estado/${toSlug(name)}${location.search}`);
    else navigate(`${MAP_BASE}${location.search}`);
  }, [navigate, location.search]);

  const handleSelectObra = useCallback((o: ObraPublica) => {
    setSelectedObra(o);
    navigate(`${MAP_BASE}/obra/${o.id}${location.search}`);
  }, [navigate, location.search]);

  const handleCloseObra = useCallback(() => {
    setSelectedObra(null);
    if (selectedState) navigate(`${MAP_BASE}/estado/${toSlug(selectedState)}${location.search}`);
    else navigate(`${MAP_BASE}${location.search}`);
  }, [navigate, selectedState, location.search]);

  const handleCloseState = useCallback(() => {
    setSelectedState(null);
    setSelectedObra(null);
    navigate(`${MAP_BASE}${location.search}`);
  }, [navigate, location.search]);

  const closeOnboarding = useCallback(() => {
    if (typeof window !== 'undefined') window.localStorage.setItem('mdo-onboarded', '1');
    setShowOnboarding(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      if (e.key === 'Escape') {
        if (showOnboarding) closeOnboarding();
        else if (selectedObra) handleCloseObra();
        else if (selectedState) handleCloseState();
        return;
      }

      if (e.key === '/' && !isTyping && !showOnboarding) {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedObra, selectedState, showOnboarding, closeOnboarding, handleCloseObra, handleCloseState]);

  const highlightLayers = useMemo(
    () => buildHighlightLayers(boundary, states, {
      selectedState,
      onStateClick: handleStateClick,
    }),
    [boundary, states, selectedState, handleStateClick],
  );
  const CLUSTER_THRESHOLD = 6.0;
  const useClusters = zoom < CLUSTER_THRESHOLD && !choroplethMode && !selectedState;

  const choroplethLayer = useMemo(
    () => (choroplethMode ? buildChoroplethLayer(states, baseObras) : null),
    [choroplethMode, states, baseObras],
  );

  const clusterLayers = useMemo(
    () => (useClusters ? buildClusterLayers(states, visibleObras, (n) => handleStateClick(n)) : []),
    [useClusters, states, visibleObras, handleStateClick],
  );

  const capitalLayers = useMemo(() => buildCapitalLayers(zoom), [zoom]);

  const layers = [
    ...highlightLayers,
    ...(choroplethLayer ? [choroplethLayer] : []),
    ...clusterLayers,
    ...capitalLayers,
    ...(choroplethMode || useClusters
      ? []
      : buildScatterLayers(visibleObras, handleSelectObra, pulseExpanded, scatterOpacity)),
  ];

  const getTooltip = useCallback(({ object }: PickingInfo) => {
    if (!object) return null;
    if ('properties' in object) {
      const name = (object.properties as { shapeName?: string; name?: string }).shapeName
        ?? (object.properties as { name?: string }).name;
      if (!name) return null;
      return {
        html: `<div style="font-weight:700">${name}</div>
               <div style="color:#94a3b8;font-size:11px">Clic para ver obras del estado</div>`,
        style: TOOLTIP_STYLE,
      };
    }
    const obra = object as ObraPublica;
    const color = STATUS_HEX[obra.estatus] ?? '#00e5ff';
    return {
      html: `
        <div style="font-weight:700;margin-bottom:4px">${obra.nombre}</div>
        <div style="color:${color};font-size:11px;margin-bottom:2px">${STATUS_LABEL[obra.estatus] ?? obra.estatus}</div>
        <div style="color:#94a3b8;font-size:11px">${obra.estado_venezuela} · ${obra.anio_inicio}</div>
      `,
      style: TOOLTIP_STYLE,
    };
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden" style={{ backgroundColor: '#06102a' }}>
      <MapContainer
        layers={layers}
        onZoomChange={handleZoomChange}
        getTooltip={getTooltip}
      />
      <TimeSlider value={yearRange} onValueChange={setYearRange} />
      <SideDrawer
        obra={selectedObra}
        selectedState={selectedState}
        obrasInState={obrasInState}
        allObras={baseObras}
        onCloseObra={handleCloseObra}
        onCloseState={handleCloseState}
        onSelectObra={handleSelectObra}
        onSelectState={(name) => handleStateClick(name)}
      />
      {!isEmbed && <Legend />}
      <HeroStats
        obras={visibleObras}
        selectedState={selectedState}
        onClearState={handleCloseState}
      />
      {!isEmbed && (
        <MapModeToggle
          choropleth={choroplethMode}
          onToggle={() => setChoroplethMode(m => !m)}
        />
      )}
      {!isEmbed && (
        <FiltersBar
          obras={yearObras}
          search={search}
          activeCategorias={activeCategorias}
          activeEstatus={activeEstatus}
          onSearchChange={setSearch}
          onToggleCategoria={toggleCategoria}
          onToggleEstatus={toggleEstatus}
          onClearAll={clearAllFilters}
        />
      )}


      {isEmbed && (
        <a
          href={`/${location.search.replace(/[?&]embed=1/, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 z-20 text-[10px] text-slate-400 hover:text-orange-400 backdrop-blur-md bg-slate-900/70 px-2 py-1 rounded"
        >
          Mapa del Olvido ↗
        </a>
      )}

      {loading && <MapSkeleton />}

      {!isEmbed && showOnboarding && <Onboarding onClose={closeOnboarding} />}
    </div>
  );
}
