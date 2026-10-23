export const gbp = (n: number) =>
  `${n < 0 ? '−' : ''}£${Math.abs(Math.round(n)).toLocaleString('en-GB')}`;

/** "£700–£840", or a single figure when both ends match. */
export const gbpRange = (r: { low: number; high: number }) =>
  Math.round(r.low) === Math.round(r.high) ? gbp(r.low) : `${gbp(r.low)}–${gbp(r.high)}`;

export const years = (r: { low: number; high: number }) => {
  const f = (n: number) => (Number.isFinite(n) && n <= 25 ? Math.round(n).toString() : '25+');
  const lo = f(r.low), hi = f(r.high);
  return lo === hi ? `${lo} years` : `${lo}–${hi} years`;
};

export const kwh = (n: number) => `${(Math.round(n / 10) * 10).toLocaleString('en-GB')} kWh`;
export const pct = (n: number) => `${Math.round(n * 100)}%`;
