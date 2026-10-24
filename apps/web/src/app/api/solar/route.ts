import { NextResponse } from 'next/server';
import { fetchPvgisYield, inUk } from '@/lib/pvgis';

/**
 * GET /api/solar?lat=&lon=&azimuth=&pitch=
 * Monthly kWh per kWp for one roof from PVGIS, or { yield: null } if PVGIS is unavailable —
 * the assessment then falls back to the built-in model and says so. Never an invented number.
 */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  // Round to ~1 km so neighbouring postcodes share a cache entry; solar data doesn't vary at that scale.
  const lat = Math.round(Number(q.get('lat')) * 100) / 100;
  const lon = Math.round(Number(q.get('lon')) * 100) / 100;
  const azimuth = Math.round(Number(q.get('azimuth')));
  const pitch = Math.round(Number(q.get('pitch')));
  if (![lat, lon, azimuth, pitch].every(Number.isFinite) || !inUk(lat, lon) || azimuth < 0 || azimuth >= 360 || pitch < 0 || pitch > 90) {
    return NextResponse.json({ error: 'Location or roof details are out of range.' }, { status: 400 });
  }
  const solarYield = await fetchPvgisYield(lat, lon, azimuth, pitch);
  return NextResponse.json(
    { yield: solarYield },
    { headers: { 'Cache-Control': solarYield ? 'public, s-maxage=2592000, stale-while-revalidate=86400' : 'no-store' } },
  );
}
