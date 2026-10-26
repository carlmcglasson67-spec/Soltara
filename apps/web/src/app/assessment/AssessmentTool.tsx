'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  assess, FLAT_EXAMPLE, OVERNIGHT_EXAMPLE,
  type Assessment, type HomeProfile, type Occupancy, type Shading, type SolarYield,
} from '@soltara/engine';
import { gbp, gbpRange, kwh, pct, years } from '@/lib/format';
import { lookupPostcode, tidyPostcode, type Place } from '@/lib/postcode';
import MonthlyChart from './MonthlyChart';
import QuoteRequest from './QuoteRequest';
import s from './assessment.module.css';

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

const STEPS = ['Your home', 'Your roof', 'Your electricity'] as const;

/** Rough conversion from a monthly bill to annual kWh: pounds a year less ~£200 standing charge, at ~25p a unit. */
const billToKwh = (monthly: number) => Math.max(800, Math.round((monthly * 12 - 200) / 0.25 / 10) * 10);

function Choice<T extends string | number>({ label, value, options, onChange, hint }: {
  label: string; value: T; options: { v: T; label: string }[]; onChange: (v: T) => void; hint?: string;
}) {
  const id = `l-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <div className={s.field}>
      <span id={id}>{label}</span>
      <div className={s.segmented} role="radiogroup" aria-labelledby={id}>
        {options.map((o) => (
          <button key={String(o.v)} type="button" role="radio" aria-checked={value === o.v}
            className={value === o.v ? s.segOn : s.seg} onClick={() => onChange(o.v)}>{o.label}</button>
        ))}
      </div>
      {hint && <small>{hint}</small>}
    </div>
  );
}

/** Ask our server for PVGIS data for this roof. Any failure → undefined, and the engine uses its built-in model. */
async function fetchSolarYield(home: HomeProfile): Promise<SolarYield | undefined> {
  const q = new URLSearchParams({
    lat: String(home.latitude), lon: String(home.longitude),
    azimuth: String(home.roof.azimuthDeg), pitch: String(home.roof.pitchDeg),
  });
  try {
    const res = await fetch(`/api/solar?${q}`, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return undefined;
    const data = (await res.json()) as { yield: SolarYield | null };
    return data.yield ?? undefined;
  } catch { return undefined; }
}

export default function AssessmentTool() {
  const [step, setStep] = useState(0);
  const [postcode, setPostcode] = useState('');
  const [place, setPlace] = useState<Place | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [looking, setLooking] = useState(false);
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
  const [working, setWorking] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLElement>(null);

  // A postcode typed on the homepage arrives as ?postcode=
  useEffect(() => {
    const pc = new URLSearchParams(window.location.search).get('postcode');
    if (pc) setPostcode(tidyPostcode(pc));
  }, []);

  const annualKwh = usageMode === 'bill' ? billToKwh(bill) : annual;

  const home: HomeProfile | null = useMemo(() => place && ({
    label: `${house.toLowerCase()} in ${place.area || place.postcode}`,
    latitude: place.latitude, longitude: place.longitude,
    roof: { pitchDeg: PITCHES[pitch], azimuthDeg: az, usableAreaM2: HOUSES[house], shading },
    annualKwh, occupancy, evAnnualMiles: ev || undefined,
  }), [place, house, az, pitch, shading, annualKwh, occupancy, ev]);

  function go(n: number) {
    setStep(n);
    requestAnimationFrame(() => panelRef.current?.focus());
  }

  async function next(e: React.FormEvent) {
    e.preventDefault();
    if (step === 0) {
      setLookupError(''); setLooking(true);
      try {
        const p = await lookupPostcode(postcode);
        setPlace(p); setPostcode(p.postcode); go(1);
      } catch (err) {
        setLookupError(err instanceof Error ? err.message : 'We couldn’t look up that postcode.');
      } finally { setLooking(false); }
      return;
    }
    if (step < STEPS.length - 1) { go(step + 1); return; }
    if (!home) { go(0); return; }
    setWorking(true);
    const solarYield = await fetchSolarYield(home);
    setWorking(false);
    setResult(assess({ ...home, solarYield }, tariff === 'overnight' ? OVERNIGHT_EXAMPLE : FLAT_EXAMPLE));
    setStep(STEPS.length);
    requestAnimationFrame(() => resultsRef.current?.focus());
  }

  const rec = result?.options.find((o) => o.id === result.recommendedId);
  const done = step >= STEPS.length;

  return (
    <div className={s.tool}>
      <ol className={s.progress} aria-label="Assessment progress">
        {[...STEPS, 'Your results'].map((label, i) => (
          <li key={label} className={i < step ? s.stepDone : i === step ? s.stepNow : s.stepTodo} aria-current={i === step ? 'step' : undefined}>
            <span className={s.stepNum}>{i + 1}</span>
            {i < step && i < STEPS.length ? (
              <button type="button" className={s.stepLink} onClick={() => go(i)}>{label}</button>
            ) : <span>{label}</span>}
          </li>
        ))}
      </ol>

      {!done && (
        <form className={s.panel} onSubmit={next}>
          <div ref={panelRef} tabIndex={-1} className={s.panelInner}>
            {step === 0 && (
              <>
                <h2 className={s.panelTitle}>Where is your home?</h2>
                <label className={s.field}>
                  <span>Postcode</span>
                  <input value={postcode} onChange={(e) => setPostcode(e.target.value)} autoComplete="postal-code"
                    placeholder="e.g. CA14 2XX" className={s.pcInput} aria-invalid={!!lookupError} aria-describedby="pc-help" required />
                  <small id="pc-help">We use it only to work out how much sun your roof gets. It isn’t saved or shared.</small>
                  {lookupError && <p className={s.error} role="alert">{lookupError}</p>}
                </label>
                <label className={s.field}>
                  <span>Type of house</span>
                  <select value={house} onChange={(e) => setHouse(e.target.value as House)}>
                    {Object.keys(HOUSES).map((h) => <option key={h}>{h}</option>)}
                  </select>
                  <small>This tells us roughly how much roof there is for panels.</small>
                </label>
              </>
            )}

            {step === 1 && (
              <>
                <h2 className={s.panelTitle}>Tell us about your roof.</h2>
                <div className={s.field}>
                  <span id="dir-label">Which way does the bigger roof slope face?</span>
                  <div className={s.compass} role="radiogroup" aria-labelledby="dir-label">
                    {DIRECTIONS.map((d) =>
                      d.az < 0 ? (
                        <span key="centre" className={s.compassCentre} aria-hidden="true">Roof</span>
                      ) : (
                        <button key={d.label} type="button" role="radio" aria-checked={az === d.az}
                          className={az === d.az ? s.compassOn : s.compassBtn} onClick={() => setAz(d.az)}>{d.label}</button>
                      ),
                    )}
                  </div>
                  <small>Not sure? The side that gets the afternoon sun faces south-west.</small>
                </div>
                <Choice label="How steep is it?" value={pitch} onChange={setPitch}
                  options={(Object.keys(PITCHES) as (keyof typeof PITCHES)[]).map((p) => ({ v: p, label: p }))} />
                <Choice label="How much shade does it get?" value={shading} onChange={setShading}
                  options={SHADES.map((o) => ({ v: o.v, label: o.label }))}
                  hint={`${SHADES.find((o) => o.v === shading)!.hint}.`} />
              </>
            )}

            {step === 2 && (
              <>
                <h2 className={s.panelTitle}>And your electricity.</h2>
                <Choice label="How would you like to tell us what you use?" value={usageMode} onChange={setUsageMode}
                  options={[{ v: 'bill', label: 'Monthly bill' }, { v: 'kwh', label: 'Units a year (kWh)' }]} />
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
                    <small>It’s on your annual statement. A typical home uses about 2,700 kWh.</small>
                  </label>
                )}
                <Choice label="Is someone usually home in the day?" value={occupancy} onChange={setOccupancy}
                  options={[{ v: 'out_daytime', label: 'Mostly out' }, { v: 'home_daytime', label: 'Mostly home' }]} />
                <label className={s.field}>
                  <span>Electric car miles a year (0 if none)</span>
                  <input type="number" inputMode="numeric" min={0} max={40000} step={500} value={ev} onChange={(e) => setEv(+e.target.value)} />
                </label>
                <Choice label="Your tariff" value={tariff} onChange={setTariff}
                  options={[{ v: 'flat', label: 'One rate all day' }, { v: 'overnight', label: 'Cheaper overnight' }]} />
              </>
            )}
          </div>

          <div className={s.nav}>
            {step > 0 && <button type="button" className="btn btn-quiet" onClick={() => go(step - 1)}>Back</button>}
            <button className="btn btn-primary btn-arrow" type="submit" disabled={looking || working}>
              {step === 0 ? (looking ? 'Finding your home' : 'Continue') : step < STEPS.length - 1 ? 'Continue' : working ? 'Working it out' : 'Show my options'}
            </button>
            <p className={s.navNote}>Step {step + 1} of {STEPS.length}. Nothing is saved or shared.</p>
          </div>
        </form>
      )}

      {done && result && (
        <section ref={resultsRef} tabIndex={-1} className={s.results} aria-label="Your results">
          {rec ? (
            <div className={s.verdict}>
              <p className={s.verdictKicker}>For your {result.home.label}, the best value over 20 years is</p>
              <h2 className={s.verdictSystem}>{rec.label}{rec.kWp > 0 ? `, ${rec.kWp.toFixed(1)} kWp` : ''}</h2>
              <div className={s.verdictFigures}>
                <div><p className={`fig ${s.big2}`}>{gbpRange(rec.annualSavingGbp)}</p><p>saving a year</p></div>
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

          {rec && rec.kWp > 0 && (
            <div className={s.chartBlock}>
              <h3 className={s.tableTitle}>Your year, month by month</h3>
              <p className={s.tableSub}>
                {rec.label}: about {kwh(rec.year.generationKwh)} of solar a year, covering {pct(rec.year.selfSufficiency)} of what you use.
              </p>
              <MonthlyChart months={rec.year.monthly} />
              <p className={s.source}>
                {result.solarSource === 'pvgis'
                  ? <>Solar figures: PVGIS satellite data for your location, roof pitch and direction (about {result.specificYieldKwhPerKwp} kWh per kWp a year after shading).</>
                  : <>Solar figures: Soltara’s built-in estimate, because live satellite data wasn’t available just now. Run it again later for location-specific figures.</>}
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
            <p>Thinking about borrowing? <a href="/warm-homes-loans">What we know about the Warm Homes Loan Scheme</a>.</p>
            <p>Your electricity today costs about {gbp(result.baseline.netCostPence / 100)} a year on these rates, before standing charges.</p>
          </details>

          <p className={s.again}><button type="button" className="btn btn-quiet" onClick={() => go(0)}>Change my answers</button></p>

          <QuoteRequest summary={rec ? `${rec.label} (${rec.kWp.toFixed(1)} kWp), ${result.home.label}, ${place?.postcode ?? ''}` : `No system recommended, ${result.home.label}`} postcode={place?.postcode ?? ''} />
        </section>
      )}
    </div>
  );
}
