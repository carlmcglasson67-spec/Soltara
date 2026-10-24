import type { RoofPlane, Shading, SolarYield } from './types';

/**
 * Hourly solar generation model.
 *
 * Monthly energy comes from a SolarYield: PVGIS data for the exact location when the caller
 * has it, otherwise the built-in latitude model (modelYield). Shading is applied on top
 * (PVGIS covers the terrain horizon, not nearby trees or buildings). Each month's energy is
 * then spread over days and daylight hours, giving 8,760 hourly kWh values.
 */

/** Typical UK monthly share of annual PV output (sums to 1). Approximate, northern England. */
export const MONTH_SHARE = [
  0.025, 0.05, 0.085, 0.115, 0.135, 0.135, 0.13, 0.115, 0.09, 0.07, 0.03, 0.02,
];
export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** Loss factor for each shading level (fraction of output kept). */
export const SHADING_FACTOR: Record<Shading, number> = {
  none: 1, light: 0.95, moderate: 0.85, heavy: 0.7,
};

/** kWh per kWp per year for a south-facing roof at ~37° pitch, by latitude. Approximate. */
export function baseSpecificYield(latitude: number): number {
  return 1000 - (latitude - 50) * 30;
}

/** Multiplier for roof direction: 1 for due south, ~0.82 for east/west, ~0.64 for north. */
export function orientationFactor(azimuthDeg: number): number {
  const offSouth = ((azimuthDeg - 180) * Math.PI) / 180;
  return 0.82 + 0.18 * Math.cos(offSouth);
}

/** Multiplier for pitch: best near 37°, ~0.86 for a flat roof. */
export function pitchFactor(pitchDeg: number): number {
  return Math.max(0.5, 1 - 0.0001 * (pitchDeg - 37) ** 2);
}

export function specificYield(latitude: number, roof: RoofPlane): number {
  return (
    baseSpecificYield(latitude) *
    orientationFactor(roof.azimuthDeg) *
    pitchFactor(roof.pitchDeg) *
    SHADING_FACTOR[roof.shading]
  );
}

/** Built-in fallback: monthly kWh per kWp from latitude, pitch and direction (no shading). */
export function modelYield(latitude: number, roof: RoofPlane): SolarYield {
  const annual = baseSpecificYield(latitude) * orientationFactor(roof.azimuthDeg) * pitchFactor(roof.pitchDeg);
  return { source: 'model', monthlyKwhPerKwp: MONTH_SHARE.map((s) => annual * s) };
}

/** kWh per kWp per year after shading. */
export function annualYield(y: SolarYield, shading: Shading): number {
  return y.monthlyKwhPerKwp.reduce((a, b) => a + b, 0) * SHADING_FACTOR[shading];
}

/** Approximate daylight hours for a day of the year at a latitude. */
export function dayLength(dayOfYear: number, latitude: number): number {
  const decl = 23.44 * Math.sin(((2 * Math.PI) / 365) * (dayOfYear - 81));
  const x = -Math.tan((latitude * Math.PI) / 180) * Math.tan((decl * Math.PI) / 180);
  return (24 / Math.PI) * Math.acos(Math.min(1, Math.max(-1, x)));
}

/**
 * Hourly generation for a year, kWh, 8,760 values.
 * Each month's energy is split evenly across its days, and each day's energy follows a
 * half-sine between sunrise and sunset centred on solar noon (12:00, ignoring clock change),
 * shifted earlier for east-facing roofs and later for west-facing ones.
 */
export function hourlyGeneration(
  kWp: number, latitude: number, roof: RoofPlane, solarYield: SolarYield = modelYield(latitude, roof),
): number[] {
  const shade = SHADING_FACTOR[roof.shading];
  const out = new Array<number>(8760).fill(0);
  // East roofs peak earlier, west roofs later: up to ±2.5 h.
  const shift = Math.sin(((roof.azimuthDeg - 180) * Math.PI) / 180) * 2.5;
  let day = 0;
  for (let m = 0; m < 12; m++) {
    const days = DAYS_IN_MONTH[m]!;
    const perDay = (kWp * solarYield.monthlyKwhPerKwp[m]! * shade) / days;
    for (let d = 0; d < days; d++, day++) {
      const len = dayLength(day + 1, latitude);
      const rise = 12 + shift - len / 2;
      // Integrate the half-sine over each hour so the day's total is exactly perDay.
      const weights: number[] = [];
      let sum = 0;
      for (let h = 0; h < 24; h++) {
        let w = 0;
        for (let s = 0; s < 4; s++) {
          const t = h + (s + 0.5) / 4;
          const phase = (t - rise) / len;
          if (phase > 0 && phase < 1) w += Math.sin(Math.PI * phase);
        }
        weights.push(w);
        sum += w;
      }
      for (let h = 0; h < 24; h++) out[day * 24 + h] = sum > 0 ? (perDay * weights[h]!) / sum : 0;
    }
  }
  return out;
}
