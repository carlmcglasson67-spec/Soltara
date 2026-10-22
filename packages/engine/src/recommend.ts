import { hourlyEvLoad, hourlyLoad } from './load';
import { batteryPriceGbp, priceRange, solarPriceGbp } from './pricing';
import { simulateYear } from './simulate';
import { hourlyGeneration } from './solar';
import type { Assessment, Battery, HomeProfile, OptionResult, SystemDesign, Tariff } from './types';

export const PANEL_WATTS = 455;
/** Roof area one panel takes including gaps, m². */
export const PANEL_FOOTPRINT_M2 = 2.0;
export const MAX_PANELS = 18;
/** Generation uncertainty used for the saving range (weather, model error). */
export const GENERATION_SPREAD = 0.1;
export const DEGRADATION_PER_YEAR = 0.005;
/** Above roughly this inverter size (kW, single phase) a G99 network application is usually needed.
 *  Phase 0 approximates inverter size by array size. */
export const G98_LIMIT_KW = 3.68;

export const BATTERIES: Record<string, Battery> = {
  '5': { capacityKwh: 5, powerKw: 2.5, roundTripEfficiency: 0.9 },
  '10': { capacityKwh: 10, powerKw: 5, roundTripEfficiency: 0.9 },
  '13.5': { capacityKwh: 13.5, powerKw: 5, roundTripEfficiency: 0.9 },
};

export function panelsThatFit(usableAreaM2: number): number {
  return Math.max(0, Math.min(MAX_PANELS, Math.floor(usableAreaM2 / PANEL_FOOTPRINT_M2)));
}

function totalLoad(home: HomeProfile): number[] {
  const base = hourlyLoad(home.annualKwh, home.occupancy);
  if (!home.evAnnualMiles) return base;
  const ev = hourlyEvLoad(home.evAnnualMiles);
  return base.map((v, i) => v + ev[i]!);
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export function assess(home: HomeProfile, tariff: Tariff): Assessment {
  const load = totalLoad(home);
  const zero = new Array<number>(load.length).fill(0);
  const baseline = simulateYear(zero, load, tariff).result;

  const panels = panelsThatFit(home.roof.usableAreaM2);
  const designs: { id: string; label: string; design: SystemDesign }[] = [];
  if (panels >= 4) {
    designs.push({ id: 'solar', label: 'Solar only', design: { panelCount: panels, panelWatts: PANEL_WATTS } });
    for (const [size, battery] of Object.entries(BATTERIES)) {
      designs.push({
        id: `solar-battery-${size}`,
        label: `Solar + ${size}kWh battery`,
        design: { panelCount: panels, panelWatts: PANEL_WATTS, battery },
      });
    }
  }
  if (tariff.allowsGridCharging) {
    designs.push({ id: 'battery-10', label: 'Battery only (10kWh, cheap-rate charging)', design: { panelCount: 0, panelWatts: PANEL_WATTS, battery: BATTERIES['10']! } });
  }

  const options: OptionResult[] = designs.map(({ id, label, design }) => {
    const kWp = (design.panelCount * design.panelWatts) / 1000;
    const gen = kWp > 0 ? hourlyGeneration(kWp, home.latitude, home.roof) : zero;
    const run = (scale: number) =>
      simulateYear(gen.map((g) => g * scale), load, tariff, design.battery).result;
    const central = run(1);
    const low = run(1 - GENERATION_SPREAD);
    const high = run(1 + GENERATION_SPREAD);
    const saving = (y: { netCostPence: number }) => (baseline.netCostPence - y.netCostPence) / 100;

    const priceCentral =
      solarPriceGbp(kWp) + batteryPriceGbp(design.battery?.capacityKwh ?? 0, kWp > 0);
    const price = priceRange(priceCentral);
    const sLow = saving(low), sHigh = saving(high), sMid = saving(central);

    let net20 = -priceCentral;
    for (let y = 0; y < 20; y++) net20 += sMid * (1 - DEGRADATION_PER_YEAR) ** y;

    const notes: string[] = [];
    if (kWp > G98_LIMIT_KW) {
      notes.push(
        `At ${r2(kWp)}kWp this system is likely to need approval from your local network operator (a G99 application) before it connects; your installer handles this, but it can add a few weeks.`,
      );
    }
    if (!kWp && design.battery) {
      notes.push('Saves money by charging on the cheap overnight rate; it does not make your own electricity.');
    }

    return {
      id, label, design, kWp: r2(kWp), year: central, notes,
      annualSavingGbp: { low: Math.round(sLow), high: Math.round(sHigh) },
      installedPriceGbp: price,
      paybackYears: {
        low: sHigh > 0 ? r2(price.low / sHigh) : Infinity,
        high: sLow > 0 ? r2(price.high / sLow) : Infinity,
      },
      net20yrGbp: Math.round(net20),
    };
  });

  const best = [...options].sort((a, b) => b.net20yrGbp - a.net20yrGbp)[0];
  const recommendedId = best && best.net20yrGbp > 0 ? best.id : 'none';

  return {
    home, tariff, baseline, options, recommendedId,
    assumptions: [
      'Solar output is an estimate from location, roof pitch, direction and shading; a site survey confirms it.',
      'Household use follows a typical UK pattern scaled to your annual kWh until smart meter data is connected.',
      `Tariff rates used: ${tariff.name}.`,
      'Prices are indicative ranges from Soltata’s price book, not quotes.',
      `Savings range allows ±${GENERATION_SPREAD * 100}% on generation; panels assumed to lose ${DEGRADATION_PER_YEAR * 100}% output a year.`,
      'Generation is modelled on average days; real weather varies day to day, so battery benefits may be slightly lower than shown.',
    ],
  };
}
