import { DAYS_IN_MONTH } from './solar';
import type { Occupancy } from './types';

/**
 * Household electricity demand, hourly, 8,760 values (kWh).
 * Phase 0: a typical UK domestic shape scaled to the household's annual use.
 * Phase 3 replaces this with the household's own smart meter half-hourly data.
 */

/** UK domestic monthly share of annual electricity use (winter heavier). Approximate; sums to 1. */
export const LOAD_MONTH_SHARE = [
  0.1, 0.09, 0.09, 0.08, 0.075, 0.07, 0.07, 0.07, 0.075, 0.085, 0.095, 0.1,
];

/** Relative demand by hour for someone out during the working day. */
const OUT_DAYTIME = [
  0.5, 0.45, 0.4, 0.4, 0.4, 0.45, 0.8, 1.2, 1.0, 0.6, 0.55, 0.55,
  0.6, 0.55, 0.55, 0.6, 0.9, 1.5, 1.9, 1.8, 1.5, 1.2, 0.9, 0.65,
];
/** Relative demand by hour for someone home most of the day. */
const HOME_DAYTIME = [
  0.5, 0.45, 0.4, 0.4, 0.4, 0.45, 0.7, 1.0, 1.0, 0.95, 0.95, 1.0,
  1.1, 1.0, 0.95, 0.95, 1.05, 1.4, 1.7, 1.6, 1.4, 1.1, 0.85, 0.6,
];

export function hourlyLoad(annualKwh: number, occupancy: Occupancy): number[] {
  const shape = occupancy === 'home_daytime' ? HOME_DAYTIME : OUT_DAYTIME;
  const shapeSum = shape.reduce((a, b) => a + b, 0);
  const out: number[] = [];
  for (let m = 0; m < 12; m++) {
    const days = DAYS_IN_MONTH[m]!;
    const perDay = (annualKwh * LOAD_MONTH_SHARE[m]!) / days;
    for (let d = 0; d < days; d++) {
      for (let h = 0; h < 24; h++) out.push((perDay * shape[h]!) / shapeSum);
    }
  }
  return out;
}

/** EV charging: ~0.3 kWh per mile, charged overnight 00:00–05:00. */
export const EV_KWH_PER_MILE = 0.3;
export function hourlyEvLoad(annualMiles: number): number[] {
  const perDay = (annualMiles * EV_KWH_PER_MILE) / 365;
  const out = new Array<number>(8760).fill(0);
  for (let day = 0; day < 365; day++) for (let h = 0; h < 5; h++) out[day * 24 + h] = perDay / 5;
  return out;
}
