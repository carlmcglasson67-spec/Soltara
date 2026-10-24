import type { SolarYield } from '@soltara/engine';

/**
 * PVGIS (EU Joint Research Centre) — satellite solar data for an exact location, roof pitch and direction.
 * Server-side only: called from /api/solar so results are cached and the browser never depends on JRC directly.
 * Docs: https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/getting-started-pvgis/api-non-interactive-service_en
 */
const PVGIS = 'https://re.jrc.ec.europa.eu/api/v5_3/PVcalc';
/** Standard PVGIS system loss for a typical domestic install (inverter, wiring, soiling). */
export const SYSTEM_LOSS_PCT = 14;
const THIRTY_DAYS = 60 * 60 * 24 * 30;

/** Rough UK bounding box: anything outside it is rejected before we call PVGIS. */
export function inUk(lat: number, lon: number): boolean {
  return lat >= 49.8 && lat <= 60.9 && lon >= -8.7 && lon <= 1.8;
}

/** Soltara azimuth (degrees from north, 180 = south) → PVGIS aspect (0 = south, 90 = west, -90 = east). */
export function toPvgisAspect(azimuthDeg: number): number {
  const a = (((azimuthDeg - 180) % 360) + 540) % 360 - 180;
  return a === -180 ? 180 : a;
}

/** Accept PVGIS output only if it looks like a UK roof: 12 sensible months, sensible total. */
export function parsePvgis(json: unknown): SolarYield | null {
  const months = (json as { outputs?: { monthly?: { fixed?: { month: number; E_m: number }[] } } })?.outputs?.monthly?.fixed;
  if (!Array.isArray(months) || months.length !== 12) return null;
  const sorted = [...months].sort((a, b) => a.month - b.month);
  const values = sorted.map((m) => m.E_m);
  if (values.some((v) => typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 250)) return null;
  const total = values.reduce((a, b) => a + b, 0);
  if (total < 300 || total > 1400) return null;
  return { source: 'pvgis', monthlyKwhPerKwp: values };
}

export async function fetchPvgisYield(lat: number, lon: number, azimuthDeg: number, pitchDeg: number): Promise<SolarYield | null> {
  const url = `${PVGIS}?${new URLSearchParams({
    lat: lat.toFixed(3), lon: lon.toFixed(3), peakpower: '1', loss: String(SYSTEM_LOSS_PCT),
    angle: String(pitchDeg), aspect: String(toPvgisAspect(azimuthDeg)), outputformat: 'json',
  })}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000), next: { revalidate: THIRTY_DAYS } });
    if (!res.ok) { console.error('[pvgis] HTTP', res.status, url); return null; }
    const parsed = parsePvgis(await res.json());
    if (!parsed) console.error('[pvgis] unexpected response', url);
    return parsed;
  } catch (err) {
    console.error('[pvgis] request failed', url, err instanceof Error ? err.message : err);
    return null;
  }
}
