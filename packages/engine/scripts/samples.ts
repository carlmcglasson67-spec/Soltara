/**
 * Phase 0 check: run three SAMPLE West Cumbria homes (made-up profiles, not real customers)
 * through the engine on both example tariffs and print the recommendation.
 * Usage: npm run samples -w @soltara/engine
 */
import { assess, EXAMPLE_TARIFFS, type HomeProfile } from '../src';

const SAMPLES: HomeProfile[] = [
  {
    label: '3-bed semi, Workington — south roof, out in the day (sample)',
    latitude: 54.64, longitude: -3.55,
    roof: { pitchDeg: 35, azimuthDeg: 180, usableAreaM2: 22, shading: 'none' },
    annualKwh: 3200, occupancy: 'out_daytime',
  },
  {
    label: '2-bed terrace, Whitehaven — east roof, home in the day (sample)',
    latitude: 54.55, longitude: -3.59,
    roof: { pitchDeg: 40, azimuthDeg: 95, usableAreaM2: 14, shading: 'light' },
    annualKwh: 2600, occupancy: 'home_daytime',
  },
  {
    label: '4-bed detached, Cockermouth — south-west roof, EV 8,000 miles (sample)',
    latitude: 54.66, longitude: -3.36,
    roof: { pitchDeg: 30, azimuthDeg: 215, usableAreaM2: 34, shading: 'light' },
    annualKwh: 4500, occupancy: 'out_daytime', evAnnualMiles: 8000,
  },
];

const gbp = (n: number) => `${n < 0 ? '−' : ''}£${Math.abs(n).toLocaleString('en-GB')}`;
const yrs = (n: number) => (Number.isFinite(n) ? n.toFixed(1) : 'never');

for (const home of SAMPLES) {
  console.log(`\n=== ${home.label}`);
  for (const tariff of EXAMPLE_TARIFFS) {
    const a = assess(home, tariff);
    console.log(`\n  Tariff: ${tariff.name}`);
    console.log(`  Current bill (energy only): ${gbp(Math.round(a.baseline.netCostPence / 100))}/yr`);
    for (const o of a.options) {
      const tag = o.id === a.recommendedId ? '  ← recommended' : '';
      console.log(
        `  - ${o.label.padEnd(42)} ${String(o.kWp).padStart(5)}kWp  gen ${Math.round(o.year.generationKwh).toString().padStart(5)}kWh  ` +
        `self-suff ${Math.round(o.year.selfSufficiency * 100)}%  save ${gbp(o.annualSavingGbp.low)}–${gbp(o.annualSavingGbp.high)}/yr  ` +
        `price ${gbp(o.installedPriceGbp.low)}–${gbp(o.installedPriceGbp.high)}  payback ${yrs(o.paybackYears.low)}–${yrs(o.paybackYears.high)}y  ` +
        `20yr net ${gbp(o.net20yrGbp)}${tag}`,
      );
      for (const n of o.notes) console.log(`      note: ${n}`);
    }
    if (a.recommendedId === 'none') console.log('  → No system pays back within 20 years on these assumptions.');
  }
}
