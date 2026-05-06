import type { Estatus } from '../types/obra';

export const STATUS_COLORS: Record<Estatus, [number, number, number]> = {
  paralizada: [255, 30, 80],   // neon red-pink
  critica: [255, 170, 0],      // neon amber
  inoperativa: [120, 255, 140], // neon green — distinct from map cyan + status red/orange
};

export const STATUS_HEX: Record<Estatus, string> = {
  paralizada: '#FF1E50',
  critica: '#FFAA00',
  inoperativa: '#78FF8C',
};
