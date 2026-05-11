export interface ImpactResult {
  schools: number;
  hospitals: number;
  universities: number;
  waterPlants: number;
  electricPlants: number;
}

// Costos de referencia (ver /metodologia)
const SCHOOL_COST_USD = 250_000;
const HOSPITAL_COST_USD = 1_500_000;
const UNIVERSITY_COST_USD = 8_000_000;
const WATER_PLANT_COST_USD = 2_000_000;
const ELECTRIC_PLANT_COST_USD = 5_000_000;

export function calculateImpact(presupuesto_usd: number): ImpactResult {
  return {
    schools: Math.floor(presupuesto_usd / SCHOOL_COST_USD),
    hospitals: Math.floor(presupuesto_usd / HOSPITAL_COST_USD),
    universities: Math.floor(presupuesto_usd / UNIVERSITY_COST_USD),
    waterPlants: Math.floor(presupuesto_usd / WATER_PLANT_COST_USD),
    electricPlants: Math.floor(presupuesto_usd / ELECTRIC_PLANT_COST_USD),
  };
}
