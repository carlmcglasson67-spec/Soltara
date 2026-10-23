'use client';

import { useMemo, useRef, useState } from 'react';
import {
  assess, FLAT_EXAMPLE, OVERNIGHT_EXAMPLE,
  type Assessment, type HomeProfile, type Occupancy, type Shading,
} from '@soltata/engine';
import { gbp, gbpRange, kwh, pct, years } from '@/lib/format';
import QuoteRequest from './QuoteRequest';
import s from './assessment.module.css';

const TOWNS: Record<string, [number, number]> = {
  Workington: [54.642, -3.547], Whitehaven: [54.548, -3.587], Cockermouth: [54.663, -3.362],
  Maryport: [54.713, -3.495], Egremont: [54.481, -3.528], Keswick: [54.6, -3.134],
  Carlisle: [54.892, -2.932], Penrith: [54.664, -2.752], Kendal: [54.328, -2.746],
  'Barrow-in-Furness': [54.111, -3.227], Lancaster: [54.047, -2.801], Preston: [53.763, -2.703],
  Manchester: [53.481, -2.242], Newcastle: [54.978, -1.617],
};

const HOUSES = {
  'Mid-terrace': 14, 'End-terrace': 18, 'Semi-detached': 20, Detached: 28, Bungalow: 30,
} as const;
type House = keyof typeof HOUSES;

const DIRECTIONS: { label: string; az: number }[] = [
  { label: 'North-west', az: 315 }, { label: 'North', az: 0 }, { label: 'North-east', az: 45 },
  { label: 'West', az: 270 }, { label: '', az: -1 }, { label: 'East', az: 90 },
  { label: 'South-west', az: 225 }, { label: 'South', az: 180 }, { label: 'South-east', az: 135 },
];

const PITCHES = { Shallow: 20, Typical: 35, Steep: 45 } as const;
const SHADES: { v: Shading; label: string; hint: string }[] = [
  { v: 'none', label: 'None', hint: 'Open sky most of the day' },
  { v: 'light', label: 'A little', hint: 'A chimney or a tree for part of the day' },
  { v: 'moderate', label: 'Some', hint: 'Trees or buildings for a few hours' },
  { v: 'heavy', label: 'A lot', hint: 'Shaded for much of the day' },
];

/** Rough conversion from a monthly bill to annual kWh: pounds a year less ~£200 standing charge, at ~25p a unit. */
const billToKwh = (monthly: number) => Math.max(800, Math.round((monthly * 12 - 200) / 0.25 / 10) * 10);

export default function AssessmentTool() {
  const [town, setTown] = useState('Workington');
  const [house, setHouse] = useState<House>('Semi-detached');
  const [az, setAz] = useState(180);
  const [pitch, setPitch] = useState<keyof typeof PITCHES>('Typical');
  const [shading, setShading] = useState<Shading>('none');
  const [usageMode, setUsageMode] = useState<'bill' | 'kwh'>('bill');
  const [bill, setBill] = useState(85);
  const [annual, setAnnual] = useState(3200);
  const [occupancy, setOccupancy] = useState<Occupancy>('out_daytime');
  const [ev, setEv] = useState(0);
  const [tariff, setTariff] = useState<'flat' | 'overnight'>('flat');
  const [result, setResult] = useState<Assessment | null>(null);
  const resultsRef = useRef<HTMLElement>(null);

  const annualKwh = usageMode === 'bill' ? billToKwh(bill) : annual;

  const home: HomeProfile = useMemo(() => {
    const [lat, lon] = TOWNS[town]!;
    return {
      label: `${house.toLowerCase()} in ${town}`,
      latitude: lat, longitude: lon,
      roof: { pitchDeg: PITCHES[pitch], azimuthDeg: az, usableAreaM2: HOUSES[house], shading },
      annualKwh, occupancy, evAnnualMiles: ev || undefined,
    };
  }, [town, house, az, pitch, shading, annualKwh, occupancy, ev]);

  function run(e: React.FormEvent) {
    e.preventDefault();
    const r = assess(home, tariff === 'overnight' ? OVERNIGHT_EXAMPLE : FLAT_EXAMPLE);
    setResult(r);
    requestAnimationFrame(() => resultsRef.current?.focus());
  }

  const rec = result?.options.find((o) => o.id === result.recommendedId);

  return (
    <>
      <form className={s.form} onSubmit={run}>
        <fieldset className={s.group}>
          <legend>Your home</legend>
          <label className={s.field}>
            <span>Nearest town</span>
            <select value={town} onChange={(e) => setTown(e.target.value)}>
              {Object.keys(TOWNS).map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label className={s.field}>
            <span>Type of house</span>
            <select value={house} onChange={(e) => setHouse(e.target.value as House)}>
              {Object.keys(HOUSES).map((h) => <option key={h}>{h}</option>)}
            </select>
            <small>We use this to estimate how much roof there is for panels.</small>
          </label>
        </fieldset>

        <fieldset className={s.group}>
          <legend>Your roof</legend>
          <div className={s.field}>
            <span id="dir-label">Which way does the bigger roof slope face?</span>
            <div className={s.compass} role="radiogroup" aria-labelledby="dir-label">
              {DIRECTIONS.map((d) =>
                d.az < 0 ? (
                  <span key="centre" className={s.compassCentre} aria-hidden="true">Roof</span>
                ) : (
                  <button
                    key={d.label} type="button" role="radio" aria-checked={az === d.az}
                    className={az === d.az ? s.compassOn : s.compassBtn}
                    onClick={() => setAz(d.az)}
                  >
                    {d.label}
                  </button>
                ),
              )}
            </div>
            <small>Not sure? Look at your house on a map: the side that gets the afternoon sun faces south-west.</small>
          </div>
          <div className={s.field}>
            <span id="pitch-label">How steep is it?</span>
            <div className={s.segmented} role="radiogroup" aria-labelledby="pitch-label">
              {(Object.keys(PITCHES) as (keyof typeof PITCHES)[]).map((p) => (
                <button key={p} type="button" role="radio" aria-checked={pitch === p}
                  className={pitch === p ? s.segOn : s.seg} onClick={() => setPitch(p)}>{p}</button>
              ))}
            </div>
          </div>
          <div className={s.field}>
            <span id="shade-label">How much shade does it get?</span>
            <div className={s.segmented} role="radiogroup" aria-labelledby="shade-label">
              {SHADES.map((o) => (
                <button key={o.v} type="button" role="radio" aria-checked={shading === o.v} title={o.hint}
                  className={shading === o.v ? s.segOn : s.seg} onClick={() => setShading(o.v)}>{o.label}</button>
              ))}
            </div>
            <small>{SHADES.find((o) => o.v === shading)!.hint}.</small>
          </div>
        </fieldset>

        <fieldset className={s.group}>
          <legend>Your electricity</legend>
          <div className={s.field}>
            <span id="usage-label">How do you want to tell us what you use?</span>
            <div className={s.segmented} role="radiogroup" aria-labelledby="usage-label">
              <button type="button" role="radio" aria-checked={usageMode === 'bill'} className={usageMode === 'bill' ? s.segOn : s.seg} onClick={() => setUsageMode('bill')}>Monthly bill</button>
              <button type="button" role="radio" aria-checked={usageMode === 'kwh'} className={usageMode === 'kwh' ? s.segOn : s.seg} onClick={() => setUsageMode('kwh')}>Units a year (kWh)</button>
            </div>
          </div>
          {usageMode === 'bill' ? (
            <label className={s.field}>
              <span>Electricity bill per month (£)</span>
              <input type="number" inputMode="numeric" min={20} max={600} value={bill} onChange={(e) => setBill(+e.target.value)} />
              <small>Electricity only. That’s roughly {annualKwh.toLocaleString('en-GB')} kWh a year.</small>
            </label>
          ) : (
            <label className={s.field}>
              <span>Electricity used per year (kWh)</span>
              <input type="number" inputMode="numeric" min={500} max={20000} step={100} value={annual} onChange={(e) => setAnnual(+e.target.value)} />
              <small>It’s on your annual statement. A typical home uses 2,700 kWh.</small>
            </label>
          )}
          <div className={s.field}>
            <span id="occ-label">Is someone usually home in the day?</span>
            <div className={s.segmented} role="radiogroup" aria-labelledby="occ-label">
              <button type="button" role="radio" aria-checked={occupancy === 'out_daytime'} className={occupancy === 'out_daytime' ? s.segOn : s.seg} onClick={() => setOccupancy('out_daytime')}>Mostly out</button>
              <button type="button" role="radio" aria-checked={occupancy === 'home_daytime'} className={occupancy === 'home_daytime' ? s.segOn : s.seg} onClick={() => setOccupancy('home_daytime')}>Mostly home</button>
            </div>
          </div>
          <label className={s.field}>
            <span>Electric car miles a year (0 if none)</span>
            <input type="number" inputMode="numeric" min={0} max={40000} step={500} value={ev} onChange={(e) => setEv(+e.target.value)} />
          </label>
          <div className={s.field}>
            <span id="tariff-label">Your tariff</span>
            <div className={s.segmented} role="radiogroup" aria-labelledby="tariff-label">
              <button type="button" role="radio" aria-checked={tariff === 'flat'} className={tariff === 'flat' ? s.segOn : s.seg} onClick={() => setTariff('flat')}>One rate all day</button>
              <button type="button" role="radio" aria-checked={tariff === 'overnight'} className={tariff === 'overnight' ? s.segOn : s.seg} onClick={() => setTariff('overnight')}>Cheaper overnight</button>
            </div>
          </div>
        </fieldset>

        <div className={s.submitRow}>
          <button className="btn btn-primary" type="submit">Show my options</button>
          <p>Nothing is saved or shared at this step.</p>
        </div>
      </form>

      {result && (
        <section ref={resultsRef} tabIndex={-1} className={s.results} aria-live="polite" aria-label="Your results">
          {rec ? (
            <div className={s.verdict}>
              <p className={s.verdictKicker}>For your {result.home.label}, the best value over 20 years is</p>
              <h2 className={s.verdictSystem}>{rec.label}{rec.kWp > 0 ? `, ${rec.kWp.toFixed(1)} kWp` : ''}</h2>
              <div className={s.verdictFigures}>
                <div><p className={`fig ${s.big}`}>{gbpRange(rec.annualSavingGbp)}</p><p>saving a year</p></div>
                <div><p className={`fig ${s.mid}`}>{gbpRange(rec.installedPriceGbp)}</p><p>installed price</p></div>
                <div><p className={`fig ${s.mid}`}>{years(rec.paybackYears)}</p><p>to pay back</p></div>
              </div>
              {rec.notes.map((n) => <p key={n} className={s.note}>{n}</p>)}
            </div>
          ) : (
            <div className={s.verdict}>
              <h2 className={s.verdictSystem}>On these answers, nothing pays for itself within 20 years.</h2>
              <p className={s.note}>
                That can happen with a small or heavily shaded roof. We’d rather tell you now than sell you something.
                Try a different tariff or roof answer if you’re unsure of yours.
              </p>
            </div>
          )}

          <h3 className={s.tableTitle}>Every option for your home</h3>
          <p className={s.tableSub}>Worked out on {result.tariff.name.toLowerCase()}.</p>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <caption className="sr-only">Every option for your home</caption>
              <thead>
                <tr><th scope="col">System</th><th scope="col">Saving a year</th><th scope="col">Installed price</th><th scope="col">Pays back in</th><th scope="col">Own solar used</th><th scope="col">20-year gain</th></tr>
              </thead>
              <tbody>
                {result.options.map((o) => (
                  <tr key={o.id} className={o.id === result.recommendedId ? s.rowBest : undefined}>
                    <th scope="row">{o.label}{o.kWp > 0 && <small>{o.kWp.toFixed(1)} kWp, about {kwh(o.year.generationKwh)} a year</small>}</th>
                    <td className="fig" data-label="Saving a year">{gbpRange(o.annualSavingGbp)}</td>
                    <td className="fig" data-label="Installed price">{gbpRange(o.installedPriceGbp)}</td>
                    <td className="fig" data-label="Pays back in">{years(o.paybackYears)}</td>
                    <td className="fig" data-label="Own solar used">{o.kWp > 0 ? pct(o.year.selfSufficiency) : 'None'}</td>
                    <td className="fig" data-label="20-year gain">{gbp(o.net20yrGbp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <details className={s.assumptions}>
            <summary>How we worked this out</summary>
            <ul>{result.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
            <p>Your electricity today costs about {gbp(result.baseline.netCostPence / 100)} a year on these rates, before standing charges.</p>
          </details>

          <QuoteRequest summary={rec ? `${rec.label} (${rec.kWp.toFixed(1)} kWp), ${result.home.label}` : `No system recommended, ${result.home.label}`} />
        </section>
      )}
    </>
  );
}
