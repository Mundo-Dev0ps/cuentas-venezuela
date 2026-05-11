// Capitales de los estados de Venezuela. Coordenadas aproximadas del centro urbano.
export interface Capital {
  estado: string;          // Matches shapeName/name in venezuela-states.geojson
  capital: string;
  lat: number;
  lng: number;
}

export const VENEZUELA_CAPITALS: Capital[] = [
  { estado: 'Amazonas',          capital: 'Puerto Ayacucho',         lat: 5.660,  lng: -67.629 },
  { estado: 'Anzoátegui',        capital: 'Barcelona',                lat: 10.137, lng: -64.687 },
  { estado: 'Apure',             capital: 'San Fernando de Apure',    lat: 7.886,  lng: -67.467 },
  { estado: 'Aragua',            capital: 'Maracay',                  lat: 10.247, lng: -67.598 },
  { estado: 'Barinas',           capital: 'Barinas',                  lat: 8.624,  lng: -70.207 },
  { estado: 'Bolívar',           capital: 'Ciudad Bolívar',           lat: 8.122,  lng: -63.549 },
  { estado: 'Carabobo',          capital: 'Valencia',                 lat: 10.181, lng: -68.003 },
  { estado: 'Cojedes',           capital: 'San Carlos',               lat: 9.659,  lng: -68.590 },
  { estado: 'Delta Amacuro',     capital: 'Tucupita',                 lat: 9.063,  lng: -62.051 },
  { estado: 'Distrito Capital',  capital: 'Caracas',                  lat: 10.480, lng: -66.904 },
  { estado: 'Falcón',            capital: 'Coro',                     lat: 11.404, lng: -69.677 },
  { estado: 'Guárico',           capital: 'San Juan de los Morros',   lat: 9.913,  lng: -67.355 },
  { estado: 'La Guaira',         capital: 'La Guaira',                lat: 10.600, lng: -66.934 },
  { estado: 'Lara',              capital: 'Barquisimeto',             lat: 10.067, lng: -69.358 },
  { estado: 'Mérida',            capital: 'Mérida',                   lat: 8.598,  lng: -71.144 },
  { estado: 'Miranda',           capital: 'Los Teques',               lat: 10.343, lng: -67.043 },
  { estado: 'Monagas',           capital: 'Maturín',                  lat: 9.744,  lng: -63.184 },
  { estado: 'Nueva Esparta',     capital: 'La Asunción',              lat: 11.036, lng: -63.864 },
  { estado: 'Portuguesa',        capital: 'Guanare',                  lat: 9.043,  lng: -69.743 },
  { estado: 'Sucre',             capital: 'Cumaná',                   lat: 10.456, lng: -64.181 },
  { estado: 'Táchira',           capital: 'San Cristóbal',            lat: 7.769,  lng: -72.224 },
  { estado: 'Trujillo',          capital: 'Trujillo',                 lat: 9.367,  lng: -70.434 },
  { estado: 'Yaracuy',           capital: 'San Felipe',               lat: 10.339, lng: -68.741 },
  { estado: 'Zulia',             capital: 'Maracaibo',                lat: 10.654, lng: -71.612 },
];
