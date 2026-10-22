import type { Range } from './types';

/**
 * Indicative installed prices. PLACEHOLDER price book for Phase 0 — replaced by real installer
 * quotes once the marketplace is live. Always shown to customers as a range, never a quote.
 */
export const PRICE_BOOK = {
  solarFixedGbp: 1800,      // scaffolding, inverter, install labour, MCS paperwork
  solarPerKwpGbp: 1150,
  batteryFixedGbp: 1500,    // battery inverter/controls and fitting
  batteryPerKwhGbp: 450,
  /** Fitting a battery at the same time as panels saves some of the fixed cost. */
  batteryWithSolarDiscountGbp: 600,
  rangeSpread: 0.12,        // ±12%
};

export function solarPriceGbp(kWp: number): number {
  return kWp > 0 ? PRICE_BOOK.solarFixedGbp + PRICE_BOOK.solarPerKwpGbp * kWp : 0;
}

export function batteryPriceGbp(capacityKwh: number, withSolar: boolean): number {
  if (capacityKwh <= 0) return 0;
  const base = PRICE_BOOK.batteryFixedGbp + PRICE_BOOK.batteryPerKwhGbp * capacityKwh;
  return withSolar ? base - PRICE_BOOK.batteryWithSolarDiscountGbp : base;
}

export function priceRange(central: number): Range {
  const s = PRICE_BOOK.rangeSpread;
  return { low: Math.round(central * (1 - s)), high: Math.round(central * (1 + s)) };
}
