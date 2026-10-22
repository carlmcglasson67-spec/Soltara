import type { Tariff } from './types';

/**
 * Example tariffs for Phase 0. These are ILLUSTRATIVE rates, not live prices: Phase 1 loads
 * real tariff data (Octopus publishes a public products API; others are maintained by hand)
 * and the report always shows which rates were used.
 */

const flat = (p: number) => new Array<number>(24).fill(p);

/** Single-rate import with a basic export payment. */
export const FLAT_EXAMPLE: Tariff = {
  id: 'flat-example',
  name: 'Single rate (example: 25p import, 15p export)',
  importPence: flat(25),
  exportPence: flat(15),
  allowsGridCharging: false,
};

/** Time-of-use import: cheap overnight 00:00–05:00, otherwise standard, with export. */
const tou = flat(28);
for (let h = 0; h < 5; h++) tou[h] = 8;
export const OVERNIGHT_EXAMPLE: Tariff = {
  id: 'overnight-example',
  name: 'Overnight cheap rate (example: 8p 00:00–05:00, 28p otherwise, 15p export)',
  importPence: tou,
  exportPence: flat(15),
  allowsGridCharging: true,
};

export const EXAMPLE_TARIFFS = [FLAT_EXAMPLE, OVERNIGHT_EXAMPLE];
