/** Monthly repayment on a fixed-rate loan (standard amortisation), pounds. Illustrative only: not a credit offer. */
export function monthlyRepayment(principalGbp: number, aprPercent: number, years: number): number {
  const n = Math.round(years * 12);
  if (n <= 0) throw new Error('loan term must be positive');
  const r = aprPercent / 100 / 12;
  if (r === 0) return principalGbp / n;
  return (principalGbp * r) / (1 - (1 + r) ** -n);
}
