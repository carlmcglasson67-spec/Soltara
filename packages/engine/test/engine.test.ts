import { describe, expect, it } from 'vitest';
import {
  assess, FLAT_EXAMPLE, hourlyGeneration, hourlyLoad, OVERNIGHT_EXAMPLE, BATTERIES,
  simulateYear, specificYield, type HomeProfile, type RoofPlane,
} from '../src';

const south: RoofPlane = { pitchDeg: 35, azimuthDeg: 180, usableAreaM2: 24, shading: 'none' };
const WORKINGTON = { latitude: 54.64, longitude: -3.55 };
const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

const home: HomeProfile = {
  label: 'test semi', ...WORKINGTON, roof: south, annualKwh: 3200, occupancy: 'out_daytime',
};

describe('solar generation', () => {
  it('gives a plausible annual yield for a south roof in West Cumbria (800–950 kWh/kWp)', () => {
    const y = specificYield(WORKINGTON.latitude, south);
    expect(y).toBeGreaterThan(800);
    expect(y).toBeLessThan(950);
  });

  it('hourly values sum to the annual figure and are never negative', () => {
    const gen = hourlyGeneration(4, WORKINGTON.latitude, south);
    expect(gen).toHaveLength(8760);
    expect(sum(gen)).toBeCloseTo(4 * specificYield(WORKINGTON.latitude, south), 3);
    expect(Math.min(...gen)).toBeGreaterThanOrEqual(0);
  });

  it('produces nothing at night and more in June than December', () => {
    const gen = hourlyGeneration(4, WORKINGTON.latitude, south);
    expect(gen[2]).toBe(0); // 02:00 on 1 Jan
    const day = (d: number) => sum(gen.slice(d * 24, d * 24 + 24));
    expect(day(172)).toBeGreaterThan(day(355) * 4);
  });

  it('ranks south > east > north, and shading reduces output', () => {
    const at = (az: number, shading: RoofPlane['shading'] = 'none') =>
      specificYield(54.6, { ...south, azimuthDeg: az, shading });
    expect(at(180)).toBeGreaterThan(at(90));
    expect(at(90)).toBeGreaterThan(at(0));
    expect(at(180, 'heavy')).toBeLessThan(at(180));
  });
});

describe('household load', () => {
  it('sums to the annual kWh', () => {
    expect(sum(hourlyLoad(3200, 'out_daytime'))).toBeCloseTo(3200, 6);
  });
});

describe('year simulation', () => {
  const load = hourlyLoad(3200, 'out_daytime');
  const gen = hourlyGeneration(4, WORKINGTON.latitude, south);

  it('balances energy: load = self-use + grid, generation = direct + stored + exported', () => {
    const { result, flows } = simulateYear(gen, load, FLAT_EXAMPLE, BATTERIES['10']);
    const gridToLoad = sum(flows.map((f) => f.gridToLoad));
    expect(result.selfUseKwh + gridToLoad).toBeCloseTo(result.loadKwh, 6);
    const genOut = sum(flows.map((f) => f.direct + f.solarToBattery + f.export));
    expect(genOut).toBeCloseTo(result.generationKwh, 6);
  });

  it('never exports more than it generates and never imports with no load and no battery', () => {
    const r = simulateYear(gen, load, FLAT_EXAMPLE).result;
    expect(r.exportKwh).toBeLessThanOrEqual(r.generationKwh);
    const empty = simulateYear(gen, new Array(8760).fill(0), FLAT_EXAMPLE).result;
    expect(empty.importKwh).toBe(0);
  });

  it('a battery raises self-sufficiency and lowers the bill', () => {
    const a = simulateYear(gen, load, FLAT_EXAMPLE).result;
    const b = simulateYear(gen, load, FLAT_EXAMPLE, BATTERIES['10']).result;
    expect(b.selfSufficiency).toBeGreaterThan(a.selfSufficiency);
    expect(b.netCostPence).toBeLessThan(a.netCostPence);
  });

  it('only charges from the grid on a time-of-use tariff', () => {
    const flat = simulateYear(gen, load, FLAT_EXAMPLE, BATTERIES['10']).flows;
    expect(sum(flat.map((f) => f.gridToBattery))).toBe(0);
    const tou = simulateYear(gen, load, OVERNIGHT_EXAMPLE, BATTERIES['10']).flows;
    expect(sum(tou.map((f) => f.gridToBattery))).toBeGreaterThan(0);
  });
});

describe('assessment', () => {
  it('returns ranges, an honest recommendation, and its assumptions', () => {
    const a = assess(home, FLAT_EXAMPLE);
    expect(a.options.length).toBeGreaterThan(0);
    for (const o of a.options) {
      expect(o.annualSavingGbp.low).toBeLessThanOrEqual(o.annualSavingGbp.high);
      expect(o.installedPriceGbp.low).toBeLessThan(o.installedPriceGbp.high);
      expect(o.paybackYears.low).toBeLessThanOrEqual(o.paybackYears.high);
    }
    expect(a.assumptions.length).toBeGreaterThan(3);
    expect([...a.options.map((o) => o.id), 'none']).toContain(a.recommendedId);
  });

  it('offers no solar options when the roof cannot fit 4 panels', () => {
    const a = assess({ ...home, roof: { ...south, usableAreaM2: 5 } }, FLAT_EXAMPLE);
    expect(a.options.filter((o) => o.kWp > 0)).toHaveLength(0);
  });

  it('offers a battery-only option on a cheap overnight tariff, without claiming solar self-sufficiency', () => {
    const a = assess(home, OVERNIGHT_EXAMPLE);
    const b = a.options.find((o) => o.id === 'battery-10');
    expect(b).toBeDefined();
    expect(b!.year.selfSufficiency).toBe(0);
    expect(b!.notes.length).toBeGreaterThan(0);
  });

  it('flags a likely G99 network application for systems above 3.68kWp', () => {
    const big = assess({ ...home, roof: { ...south, usableAreaM2: 30 } }, FLAT_EXAMPLE);
    const solar = big.options.find((o) => o.id === 'solar')!;
    expect(solar.kWp).toBeGreaterThan(3.68);
    expect(solar.notes.join(' ')).toMatch(/G99/);
  });
});
