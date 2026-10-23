import { assess, OVERNIGHT_EXAMPLE, type HomeProfile } from '@soltara/engine';

/** The example home shown on the homepage. Computed by the real engine at build time,
 *  so the hero never shows a number the product can't produce. */
export const SAMPLE_HOME: HomeProfile = {
  label: '3-bed semi in Workington',
  latitude: 54.64,
  longitude: -3.55,
  roof: { pitchDeg: 35, azimuthDeg: 180, usableAreaM2: 22, shading: 'none' },
  annualKwh: 3200,
  occupancy: 'out_daytime',
};

export function sampleAssessment() {
  const a = assess(SAMPLE_HOME, OVERNIGHT_EXAMPLE);
  const rec = a.options.find((o) => o.id === a.recommendedId) ?? a.options[0]!;
  return { assessment: a, recommended: rec };
}
