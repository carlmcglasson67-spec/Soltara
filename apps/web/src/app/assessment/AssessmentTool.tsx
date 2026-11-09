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

function Choice<T extends string | number>({ label, value, options, onChange, hint, cols }: {
  label: string; value: T; options: { v: T; label: string; sub?: string; icon?: React.ReactNode }[];
  onChange: (v: T) => void; hint?: string; cols?: number;
}) {
  const id = `l-${label.replace(/\W+/g, '-').toLowerCase()}`;
  const idx = Math.max(0, options.findIndex((o) => o.v === value));
  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (idx + d + options.length) % options.length;
    onChange(options[n]!.v);
    e.currentTarget.querySelectorAll<HTMLButtonElement>('[role=radio]')[n]?.focus();
  };
  return (
    <div className={s.field}>
      <span id={id} className={s.q}>{label}</span>
      <div className={s.tiles} role="radiogroup" aria-labelledby={id} onKeyDown={onKey}
        style={{ ['--cols' as string]: cols ?? options.length }}>
        {options.map((o) => (
          <button key={String(o.v)} type="button" role="radio" aria-checked={value === o.v} tabIndex={value === o.v ? 0 : -1}
            className={s.tile} onClick={() => onChange(o.v)}>
            {o.icon && <span className={s.tileIcon} aria-hidden="true">{o.icon}</span>}
            <span className={s.tileLabel}>{o.label}</span>
            {o.sub && <span className={s.tileSub}>{o.sub}</span>}
          </button>
        ))}
      </div>
      {hint && <small>{hint}</small>}
    </div>
  );
}

/** A roof at the given pitch, drawn to scale: the shape of the choice is the answer. */
function RoofPitch({ deg }: { deg: number }) {
  const r = (deg * Math.PI) / 180; const half = 26; const rise = Math.tan(r) * half;
  return (
    <svg viewBox="0 0 64 40" width="64" height="40">
      <path d={`M${32 - half} 36 L32 ${36 - rise} L${32 + half} 36`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d={`M${32 - half + 6} 36 V38 M${32 + half - 6} 36 V38`} stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/** A compass arrow pointing the way the roof faces (0° = north, up). */
function Arrow({ az }: { az: number }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" style={{ transform: `rotate(${az}deg)` }}>
      <path d="M12 3v15M6.5 8.5 12 3l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const SHADE_WORDS: Record<Shading, string> = { none: 'no shade', light: 'a little shade', moderate: 'some shade', heavy: 'a lot of shade' };
const SHADE_ICON: Record<Shading, number> = { none: 0, light: 1, moderate: 2, heavy: 3 };
function Shade({ level }: { level: number }) {
  return (
    <svg viewBox="0 0 40 24" width="40" height="24">
      <circle cx="12" cy="12" r="6" fill="currentColor" opacity=".9" />
      {Array.from({ length: level }, (_, i) => <rect key={i} x={20 + i * 6} y={6 - i} width="4" height={14 + i} rx="2" fill="currentColor" opacity=".45" />)}
    </svg>
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
  const facingLabel = DIRECTIONS.find((d) => d.az === az)?.label ?? 'South';
  const bestNet = result ? Math.max(1, ...result.options.map((o) => o.net20yrGbp)) : 1;

  // What we know so far, shown beside the questions so the answers feel like a record, not a form.
  const summary: { k: string; v: string; at: number }[] = [
    { k: 'Postcode', v: place ? `${place.postcode}${place.area ? ` · ${place.area}` : ''}` : postcode ? tidyPostcode(postcode) : '—', at: 0 },
    { k: 'House', v: `${house} · about ${HOUSES[house]} m² of roof`, at: 0 },
    { k: 'Roof', v: step >= 1 ? `Faces ${facingLabel.toLowerCase()} · ${pitch.toLowerCase()} · ${SHADE_WORDS[shading]}` : '—', at: 1 },
    { k: 'Electricity', v: step >= 2 ? `${annualKwh.toLocaleString('en-GB')} kWh a year${ev ? ` · ${ev.toLocaleString('en-GB')} EV miles` : ''}` : '—', at: 2 },
    { k: 'Tariff', v: step >= 2 ? (tariff === 'overnight' ? 'Cheaper overnight' : 'One rate all day') : '—', at: 2 },
  ];

  return (
    <div className={`${s.shell} grain`} data-surface="dark">
      <aside className={s.rail}>
        <p className="kicker kicker-light">Free home energy assessment</p>
        <h1 className={s.title}>See what your home <em>could save.</em></h1>

        <ol className={s.stations} aria-label="Assessment progress">
          {[...STEPS, 'Your results'].map((label, i) => (
            <li key={label} className={i < step ? s.stDone : i === step ? s.stNow : s.stTodo} aria-current={i === step ? 'step' : undefined}>
              <span className={`fig ${s.stNum}`}>0{i + 1}</span>
              {i < step && i < STEPS.length ? (
                <button type="button" className={s.stLink} onClick={() => go(i)}>{label}<span className="sr-only"> (change)</span></button>
              ) : <span>{label}</span>}
            </li>
          ))}
        </ol>

        <dl className={s.ledger} aria-label="Your answers so far">
          {summary.map((r) => (
            <div key={r.k} className={step >= r.at ? s.ledgerOn : undefined}>
              <dt>{r.k}</dt><dd>{r.v}</dd>
            </div>
          ))}
        </dl>
        <p className={s.privacy}>Runs in your browser. Nothing is saved or shared unless you ask for quotes.</p>
      </aside>

      <div className={s.stage}>
        {!done && (
          <form className={s.panel} onSubmit={next}>
            <div ref={panelRef} tabIndex={-1} className={s.panelInner}>
              <p className={`fig ${s.stepOf}`}>Step {step + 1} of {STEPS.length}</p>
              {step === 0 && (
                <>
                  <h2 className={s.panelTitle}>Where is your home?</h2>
                  <label className={s.field}>
                    <span className={s.q}>Postcode</span>
                    <input value={postcode} onChange={(e) => setPostcode(e.target.value)} autoComplete="postal-code"
                      placeholder="e.g. CA14 2XX" className={s.pcInput} aria-invalid={!!lookupError} aria-describedby="pc-help" required />
                    <small id="pc-help">Used only to work out how much sun your roof gets. It isn’t saved or shared.</small>
                    {lookupError && <p className={s.error} role="alert">{lookupError}</p>}
                  </label>
                  <Choice label="Type of house" value={house} onChange={setHouse} cols={5}
                    options={(Object.keys(HOUSES) as House[]).map((h) => ({ v: h, label: h, sub: `~${HOUSES[h]} m² roof` }))}
                    hint="This tells us roughly how much roof there is for panels." />
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className={s.panelTitle}>Tell us about your roof.</h2>
                  <div className={s.field}>
                    <span id="dir-label" className={s.q}>Which way does the bigger roof slope face?</span>
                    <div className={s.compass} role="radiogroup" aria-labelledby="dir-label">
                      {DIRECTIONS.map((d) =>
                        d.az < 0 ? (
                          <span key="centre" className={s.compassCentre} aria-hidden="true"><span>N</span>Roof</span>
                        ) : (
                          <button key={d.label} type="button" role="radio" aria-checked={az === d.az}
                            className={s.compassBtn} onClick={() => setAz(d.az)}>
                            <Arrow az={d.az} /><span>{d.label}</span>
                          </button>
                        ),
                      )}
                    </div>
                    <small>Not sure? The side that gets the afternoon sun faces south-west.</small>
                  </div>
                  <Choice label="How steep is it?" value={pitch} onChange={setPitch}
                    options={(Object.keys(PITCHES) as (keyof typeof PITCHES)[]).map((p) => ({ v: p, label: p, sub: `about ${PITCHES[p]}°`, icon: <RoofPitch deg={PITCHES[p]} /> }))} />
                  <Choice label="How much shade does it get?" value={shading} onChange={setShading} cols={4}
                    options={SHADES.map((o) => ({ v: o.v, label: o.label, icon: <Shade level={SHADE_ICON[o.v]} /> }))}
                    hint={`${SHADES.find((o) => o.v === shading)!.hint}.`} />
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className={s.panelTitle}>And your electricity.</h2>
                  <Choice label="How would you like to tell us what you use?" value={usageMode} onChange={setUsageMode}
                    options={[{ v: 'bill', label: 'Monthly bill' }, { v: 'kwh', label: 'Units a year (kWh)' }]} />
                  <div className={s.pair}>
                    {usageMode === 'bill' ? (
                      <label className={s.field}>
                        <span className={s.q}>Electricity bill per month</span>
                        <span className={s.affix}><i aria-hidden="true">£</i>
                          <input type="number" inputMode="numeric" min={20} max={600} value={bill} onChange={(e) => setBill(+e.target.value)} />
                        </span>
                        <small>Electricity only. That’s roughly {annualKwh.toLocaleString('en-GB')} kWh a year.</small>
                      </label>
                    ) : (
                      <label className={s.field}>
                        <span className={s.q}>Electricity used per year</span>
                        <span className={s.affix}>
                          <input type="number" inputMode="numeric" min={500} max={20000} step={100} value={annual} onChange={(e) => setAnnual(+e.target.value)} /><i aria-hidden="true">kWh</i>
                        </span>
                        <small>It’s on your annual statement. A typical home uses about 2,700 kWh.</small>
                      </label>
                    )}
                    <label className={s.field}>
                      <span className={s.q}>Electric car miles a year</span>
                      <span className={s.affix}>
                        <input type="number" inputMode="numeric" min={0} max={40000} step={500} value={ev} onChange={(e) => setEv(+e.target.value)} /><i aria-hidden="true">miles</i>
                      </span>
                      <small>Leave at 0 if you don’t have one.</small>
                    </label>
                  </div>
                  <Choice label="Is someone usually home in the day?" value={occupancy} onChange={setOccupancy}
                    options={[{ v: 'out_daytime', label: 'Mostly out' }, { v: 'home_daytime', label: 'Mostly home' }]} />
                  <Choice label="Your tariff" value={tariff} onChange={setTariff}
                    options={[{ v: 'flat', label: 'One rate all day' }, { v: 'overnight', label: 'Cheaper overnight', sub: 'e.g. an EV or battery tariff' }]} />
                </>
              )}
            </div>

            <div className={s.nav}>
              {step > 0 && <button type="button" className="btn btn-quiet" onClick={() => go(step - 1)}>Back</button>}
              <button className="btn btn-primary btn-arrow btn-lg" type="submit" disabled={looking || working}>
                {step === 0 ? (looking ? 'Finding your home' : 'Continue') : step < STEPS.length - 1 ? 'Continue' : working ? 'Working it out' : 'Show my options'}
              </button>
            </div>
          </form>
        )}

        {done && result && (
          <section ref={resultsRef} tabIndex={-1} className={s.results} aria-label="Your results">
            {rec ? (
              <div className={s.verdict}>
                <p className={s.verdictKicker}>For your {result.home.label}, the best value over 20 years is</p>
                <h2 className={s.verdictSystem}>{rec.label}{rec.kWp > 0 && <span className="fig">{rec.kWp.toFixed(1)} kWp</span>}</h2>
                <dl className={s.verdictFigures}>
                  <div className={s.vMain}><dt>Saving a year</dt><dd className={s.big}>{gbpRange(rec.annualSavingGbp)}</dd></div>
                  <div><dt>Installed price</dt><dd className="fig">{gbpRange(rec.installedPriceGbp)}</dd></div>
                  <div><dt>Pays back in</dt><dd className="fig">{years(rec.paybackYears)}</dd></div>
                  <div><dt>Back over 20 years</dt><dd className="fig">{gbpRange(rec.net20yrRangeGbp)}</dd></div>
                </dl>
                {rec.notes.map((n) => <p key={n} className={s.note}>{n}</p>)}
              </div>
            ) : (
              <div className={s.verdict}>
                <p className={s.verdictKicker}>An honest answer</p>
                <h2 className={s.verdictSystem}>On these answers, nothing pays for itself within 20 years.</h2>
                <p className={s.note}>
                  That can happen with a small or heavily shaded roof. We’d rather tell you now than sell you something.
                  Try a different tariff or roof answer if you’re unsure of yours.
                </p>
              </div>
            )}

            {rec && rec.kWp > 0 && (
              <div className={s.card}>
                <div className={s.cardHead}>
                  <h3 className={s.cardTitle}>Your year, month by month</h3>
                  <p className={s.cardSub}>
                    {rec.label}: about {kwh(rec.year.generationKwh)} of solar a year, covering {pct(rec.year.selfSufficiency)} of what you use.
                  </p>
                </div>
                <MonthlyChart months={rec.year.monthly} />
                <p className={s.source}>
                  {result.solarSource === 'pvgis'
                    ? <>Solar figures: PVGIS satellite data for your location, roof pitch and direction (about {result.specificYieldKwhPerKwp} kWh per kWp a year after shading).</>
                    : <>Solar figures: Soltara’s built-in estimate, because live satellite data wasn’t available just now. Run it again later for location-specific figures.</>}
                </p>
              </div>
            )}

            <div className={s.card}>
              <div className={s.cardHead}>
                <h3 className={s.cardTitle}>Every option for your home</h3>
                <p className={s.cardSub}>Worked out on {result.tariff.name.toLowerCase()}. The bar shows the central case over 20 years; the figure is the range.</p>
              </div>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <caption className="sr-only">Every option for your home</caption>
                  <thead>
                    <tr><th scope="col">System</th><th scope="col">Saving a year</th><th scope="col">Installed price</th><th scope="col">Pays back in</th><th scope="col">Use covered by solar</th><th scope="col">Back over 20 years</th></tr>
                  </thead>
                  <tbody>
                    {result.options.map((o) => (
                      <tr key={o.id} className={o.id === result.recommendedId ? s.rowBest : undefined}>
                        <th scope="row">{o.label}{o.id === result.recommendedId && <span className={s.bestTag}>Best value over 20 years</span>}{o.kWp > 0 && <small>{o.kWp.toFixed(1)} kWp, about {kwh(o.year.generationKwh)} a year</small>}</th>
                        <td className="fig" data-label="Saving a year">{gbpRange(o.annualSavingGbp)}</td>
                        <td className="fig" data-label="Installed price">{gbpRange(o.installedPriceGbp)}</td>
                        <td className="fig" data-label="Pays back in">{years(o.paybackYears)}</td>
                        <td className="fig" data-label="Use covered by solar">{o.kWp > 0 ? pct(o.year.selfSufficiency) : 'None'}</td>
                        <td data-label="Back over 20 years" className={s.barCell}>
                          <span className={s.bar}>
                            <i style={{ ['--w' as string]: `${Math.max(0, o.net20yrGbp / bestNet) * 100}%` }} />
                            <b className="fig" title={`Central case ${gbp(o.net20yrGbp)}`}>{gbpRange(o.net20yrRangeGbp)}</b>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <details className={s.assumptions}>
                <summary>How we worked this out<span aria-hidden="true" /></summary>
                <ul>{result.assumptions.map((a) => <li key={a}>{a}</li>)}</ul>
                <p>Your electricity today costs about {gbp(result.baseline.netCostPence / 100)} a year on these rates, before standing charges.</p>
                <p>Thinking about borrowing? <a href="/warm-homes-loans">What we know about the Warm Homes Loan Scheme</a>.</p>
              </details>
            </div>

            <div className={s.again}>
              <button type="button" className="btn btn-ghost" onClick={() => go(0)}>Change my answers</button>
            </div>

            <QuoteRequest summary={rec ? `${rec.label} (${rec.kWp.toFixed(1)} kWp), ${result.home.label}, ${place?.postcode ?? ''}` : `No system recommended, ${result.home.label}`} postcode={place?.postcode ?? ''} />
          </section>
        )}
      </div>
    </div>
  );
}
