/**
 * Soltara assessment engine — core types.
 *
 * Conventions
 * - Energy in kWh, power in kW, money in pence unless a field says otherwise.
 * - A simulated year is 365 days x 24 hourly steps (8,760 steps), index = day * 24 + hour.
 * - Azimuth in degrees clockwise from north (90 = east, 180 = south, 270 = west).
 */

export type Shading = 'none' | 'light' | 'moderate' | 'heavy';
export type Occupancy = 'out_daytime' | 'home_daytime';

export interface RoofPlane {
  /** Roof pitch from horizontal, degrees. */
  pitchDeg: number;
  /** Direction the roof plane faces, degrees from north. */
  azimuthDeg: number;
  /** Area free of windows, vents and edge set-backs, m². */
  usableAreaM2: number;
  shading: Shading;
}

export interface HomeProfile {
  /** Free-text label for reports, e.g. "3-bed semi, Workington (sample)". */
  label: string;
  latitude: number;
  longitude: number;
  roof: RoofPlane;
  /** Household electricity use per year excluding EV charging, kWh. */
  annualKwh: number;
  occupancy: Occupancy;
  /** Annual EV miles if the household has or plans an EV. */
  evAnnualMiles?: number;
}

export interface Tariff {
  id: string;
  name: string;
  /** Import price for each hour of the day, pence per kWh (24 values). */
  importPence: number[];
  /** Export price for each hour of the day, pence per kWh (24 values). */
  exportPence: number[];
  /** True if the battery may charge from the grid in the cheapest hours. */
  allowsGridCharging: boolean;
}

export interface Battery {
  /** Usable capacity, kWh. */
  capacityKwh: number;
  /** Max charge/discharge power, kW. */
  powerKw: number;
  /** Round-trip efficiency, 0–1 (applied on the charge leg). */
  roundTripEfficiency: number;
}

export interface SystemDesign {
  panelCount: number;
  panelWatts: number;
  battery?: Battery;
}

export interface YearResult {
  generationKwh: number;
  loadKwh: number;
  selfUseKwh: number;
  importKwh: number;
  exportKwh: number;
  /** Annual cost of imports minus export income, pence. */
  netCostPence: number;
  /** Share of household load met by the home's own solar (directly or via the battery), 0–1.
   *  Grid energy stored in the battery on a cheap rate does not count. */
  selfSufficiency: number;
}

export interface Range { low: number; high: number }

export interface OptionResult {
  id: string;
  label: string;
  design: SystemDesign;
  kWp: number;
  year: YearResult;
  /** Bill saving vs no system on the same tariff, pounds per year. */
  annualSavingGbp: Range;
  /** Indicative installed price, pounds. */
  installedPriceGbp: Range;
  /** Simple payback, years. */
  paybackYears: Range;
  /** Saving minus price over 20 years with panel degradation, pounds (central case). */
  net20yrGbp: number;
  /** Plain-English points the customer should know about this option. */
  notes: string[];
}

export interface Assessment {
  home: HomeProfile;
  tariff: Tariff;
  baseline: YearResult;
  options: OptionResult[];
  recommendedId: string;
  assumptions: string[];
}
