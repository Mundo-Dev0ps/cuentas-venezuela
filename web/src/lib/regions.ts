// Chile DPA: 16 regions, ISO codes, capital lat/lng (matches etl/pipelines/_regions.py).
export interface RegionMeta {
  code: string;
  name: string;
  lat: number;
  lng: number;
}

export const REGIONS: RegionMeta[] = [
  { code: "CL-AP", name: "Arica y Parinacota", lat: -18.4783, lng: -70.3126 },
  { code: "CL-TA", name: "Tarapacá", lat: -20.2208, lng: -70.1431 },
  { code: "CL-AN", name: "Antofagasta", lat: -23.6509, lng: -70.3975 },
  { code: "CL-AT", name: "Atacama", lat: -27.3668, lng: -70.3322 },
  { code: "CL-CO", name: "Coquimbo", lat: -29.9533, lng: -71.3395 },
  { code: "CL-VS", name: "Valparaíso", lat: -33.0472, lng: -71.6127 },
  { code: "CL-RM", name: "Metropolitana", lat: -33.4489, lng: -70.6693 },
  { code: "CL-LI", name: "O'Higgins", lat: -34.1701, lng: -70.7406 },
  { code: "CL-ML", name: "Maule", lat: -35.4232, lng: -71.6481 },
  { code: "CL-NB", name: "Ñuble", lat: -36.6066, lng: -72.1034 },
  { code: "CL-BI", name: "Biobío", lat: -36.827, lng: -73.0498 },
  { code: "CL-AR", name: "La Araucanía", lat: -38.7359, lng: -72.5904 },
  { code: "CL-LR", name: "Los Ríos", lat: -39.8142, lng: -73.2459 },
  { code: "CL-LL", name: "Los Lagos", lat: -41.4717, lng: -72.9369 },
  { code: "CL-AI", name: "Aysén", lat: -45.5752, lng: -72.066 },
  { code: "CL-MA", name: "Magallanes", lat: -53.1638, lng: -70.9171 },
];

export const REGION_BY_CODE = Object.fromEntries(
  REGIONS.map((r) => [r.code, r]),
);
