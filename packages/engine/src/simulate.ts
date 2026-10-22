import type { Battery, Tariff, YearResult } from './types';

export interface HourFlows {
  direct: number;         // solar used straight away
  solarToBattery: number; // solar stored
  gridToBattery: number;  // cheap-rate grid energy stored
  batteryToLoad: number;  // stored energy used
  export: number;
  gridToLoad: number;
}

/** Hours of the day treated as cheap for grid charging: within 1p of the cheapest rate, and
 *  only if that rate is well below the dearest one (otherwise charging isn't worth it). */
export function cheapHours(tariff: Tariff, battery?: Battery): Set<number> {
  const min = Math.min(...tariff.importPence);
  const max = Math.max(...tariff.importPence);
  const eff = battery?.roundTripEfficiency ?? 0.9;
  const set = new Set<number>();
  if (!tariff.allowsGridCharging || min >= max * eff * 0.75) return set;
  tariff.importPence.forEach((p, h) => { if (p <= min + 1) set.add(h); });
  return set;
}

/**
 * Simulate one year hour by hour.
 * Battery rules: solar surplus charges it first; in cheap hours (time-of-use tariffs) it also
 * tops up from the grid and is held rather than discharged; otherwise it covers any shortfall.
 * Efficiency losses are taken on the charge leg. The battery starts the year empty.
 */
export function simulateYear(
  generation: number[],
  load: number[],
  tariff: Tariff,
  battery?: Battery,
): { result: YearResult; flows: HourFlows[] } {
  if (generation.length !== load.length) throw new Error('generation and load lengths differ');
  const cheap = cheapHours(tariff, battery);
  const eff = battery?.roundTripEfficiency ?? 1;
  let soc = 0;
  // Track how much of the stored energy came from the panels, so grid-charged energy is
  // never counted as the home's own solar.
  let socSolar = 0;
  const flows: HourFlows[] = [];
  let gen = 0, ld = 0, selfUse = 0, solarUsed = 0, imp = 0, exp = 0, cost = 0;

  for (let i = 0; i < load.length; i++) {
    const hour = i % 24;
    const g = generation[i]!;
    const l = load[i]!;
    const direct = Math.min(g, l);
    let surplus = g - direct;
    let deficit = l - direct;
    let solarToBattery = 0, gridToBattery = 0, batteryToLoad = 0;

    if (battery) {
      const room = (battery.capacityKwh - soc) / eff;
      solarToBattery = Math.min(surplus, battery.powerKw, room);
      soc += solarToBattery * eff;
      socSolar += solarToBattery * eff;
      surplus -= solarToBattery;

      if (cheap.has(hour)) {
        const room2 = (battery.capacityKwh - soc) / eff;
        gridToBattery = Math.min(battery.powerKw - solarToBattery, room2);
        soc += gridToBattery * eff;
      } else {
        batteryToLoad = Math.min(deficit, battery.powerKw, soc);
        const solarShare = soc > 0 ? socSolar / soc : 0;
        solarUsed += batteryToLoad * solarShare;
        socSolar -= batteryToLoad * solarShare;
        soc -= batteryToLoad;
        deficit -= batteryToLoad;
      }
    }
    solarUsed += direct;

    const gridToLoad = deficit;
    const hourImport = gridToLoad + gridToBattery;
    const hourExport = surplus;
    flows.push({ direct, solarToBattery, gridToBattery, batteryToLoad, export: hourExport, gridToLoad });

    gen += g; ld += l;
    selfUse += direct + batteryToLoad;
    imp += hourImport; exp += hourExport;
    cost += hourImport * tariff.importPence[hour]! - hourExport * tariff.exportPence[hour]!;
  }

  return {
    result: {
      generationKwh: gen,
      loadKwh: ld,
      selfUseKwh: selfUse,
      importKwh: imp,
      exportKwh: exp,
      netCostPence: cost,
      selfSufficiency: ld > 0 ? solarUsed / ld : 0,
    },
    flows,
  };
}
