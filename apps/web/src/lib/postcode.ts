/** UK postcode lookup via postcodes.io (free, open data, no key). Used only to place the home on the map
 *  for solar yield; the postcode is not stored at this step. */

export interface Place { postcode: string; latitude: number; longitude: number; area: string }

const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

export function tidyPostcode(raw: string): string {
  const p = raw.trim().toUpperCase().replace(/\s+/g, '');
  return p.length > 3 ? `${p.slice(0, -3)} ${p.slice(-3)}` : p;
}

export function looksLikePostcode(raw: string): boolean {
  return UK_POSTCODE.test(raw.trim());
}

export async function lookupPostcode(raw: string): Promise<Place> {
  if (!looksLikePostcode(raw)) throw new Error('Enter a full UK postcode, for example CA14 2XX.');
  const pc = tidyPostcode(raw);
  let res: Response;
  try {
    res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`);
  } catch {
    throw new Error('We couldn’t look up your postcode just now. Check your connection and try again.');
  }
  if (res.status === 404) throw new Error(`We couldn’t find ${pc}. Check it and try again.`);
  if (!res.ok) throw new Error('We couldn’t look up your postcode just now. Try again in a moment.');
  const body = await res.json();
  const r = body.result;
  if (r?.latitude == null || r?.longitude == null) throw new Error(`We couldn’t place ${pc} on the map. Try a neighbouring postcode.`);
  return { postcode: r.postcode ?? pc, latitude: r.latitude, longitude: r.longitude, area: r.admin_district ?? r.parish ?? '' };
}
