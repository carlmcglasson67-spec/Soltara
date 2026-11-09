'use client';

import { assess, OVERNIGHT_EXAMPLE, type Assessment, type HomeProfile } from '@soltara/engine';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { SAMPLE_HOME } from '@/lib/sample';
import s from './engine.module.css';

/**
 * The Soltara Engine, live. Every change to a control re-runs the real assessment engine on the visitor's
 * device, in a Web Worker so the page never stalls: a baseline year plus low, central and high years for each
 * system, 8,760 hourly steps each, on example tariff rates. The compute time shown is measured, not decorative.
 * Nothing here is sent anywhere.
 */

type Inputs = { azimuth: number; pitch: number; use: number; home: boolean };
const START: Inputs = { azimuth: SAMPLE_HOME.roof.azimuthDeg, pitch: SAMPLE_HOME.roof.pitchDeg, use: SAMPLE_HOME.annualKwh, home: false };
const MONTHS = 'JFMAMJJASOND'.split('');

function toHome(i: Inputs): HomeProfile {
  return {
    ...SAMPLE_HOME,
    roof: { ...SAMPLE_HOME.roof, azimuthDeg: i.azimuth, pitchDeg: i.pitch },
    annualKwh: i.use,
    occupancy: i.home ? 'home_daytime' : 'out_daytime',
  };
}

function facing(az: number): string {
  const names = ['east', 'east-south-east', 'south-east', 'south-south-east', 'south', 'south-south-west', 'south-west', 'west-south-west', 'west'];
  return names[Math.round((az - 90) / 22.5)] ?? 'south';
}
const cap = (t: string) => t.replace(/^./, (c) => c.toUpperCase());
const money = (n: number) => `£${Math.round(n).toLocaleString('en-GB')}`;

type Shown = { low: number; high: number; gen: number; self: number; yieldK: number };

/** Ease every readout towards its target in one animation loop and one state update per frame. */
function useTweens(target: Shown, ms = 520): Shown {
  const [shown, setShown] = useState(target);
  const cur = useRef(target);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const from = cur.current;
    if (reduce) { cur.current = target; setShown(target); return; }
    const t0 = performance.now(); let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms); const e = 1 - Math.pow(1 - k, 3);
      const next = {} as Shown;
      (Object.keys(target) as (keyof Shown)[]).forEach((key) => { next[key] = from[key] + (target[key] - from[key]) * e; });
      cur.current = next; setShown(next);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return shown;
}

export default function Engine({ initial }: { initial: Assessment }) {
  const [inputs, setInputs] = useState<Inputs>(START);
  const [result, setResult] = useState<Assessment>(initial);
  const [ms, setMs] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [announce, setAnnounce] = useState('');
  const worker = useRef<Worker | null>(null);
  const latest = useRef(0);
  const first = useRef(true);

  useEffect(() => {
    try {
      const w = new Worker(new URL('./engine.worker.ts', import.meta.url), { type: 'module' });
      w.onmessage = (e: MessageEvent<{ id: number; result: Assessment; ms: number }>) => {
        if (e.data.id !== latest.current) return; // a newer run is on its way; keep only the latest
        setResult(e.data.result); setMs(e.data.ms); setBusy(false);
      };
      worker.current = w;
      return () => w.terminate();
    } catch { worker.current = null; }
  }, []);

  useEffect(() => {
    if (first.current) { first.current = false; return; } // the first result arrived from the server
    const id = ++latest.current;
    setBusy(true);
    const home = toHome(inputs);
    if (worker.current) { worker.current.postMessage({ id, home }); return; }
    const raf = requestAnimationFrame(() => { // no Worker support: run on the next frame instead
      const t0 = performance.now(); const r = assess(home, OVERNIGHT_EXAMPLE);
      if (id === latest.current) { setResult(r); setMs(performance.now() - t0); setBusy(false); }
    });
    return () => cancelAnimationFrame(raf);
  }, [inputs]);

  const none = result.recommendedId === 'none';
  const rec = result.options.find((o) => o.id === result.recommendedId) ?? result.options[0]!;
  const target = useMemo<Shown>(() => ({
    low: rec.annualSavingGbp.low, high: rec.annualSavingGbp.high, gen: rec.year.generationKwh,
    self: rec.year.selfSufficiency * 100, yieldK: result.specificYieldKwhPerKwp,
  }), [rec, result.specificYieldKwhPerKwp]);
  const v = useTweens(target);
  const maxMonth = useMemo(() => Math.max(...rec.year.monthly.map((m) => m.generationKwh), 1), [rec]);

  // One calm announcement for screen readers once the result settles, not every animation frame.
  useEffect(() => {
    if (ms == null) return;
    const t = setTimeout(() => setAnnounce(none
      ? 'No system pays back on this example home.'
      : `${rec.label}: estimated saving ${money(rec.annualSavingGbp.low)} to ${money(rec.annualSavingGbp.high)} a year.`), 400);
    return () => clearTimeout(t);
  }, [rec, none, ms]);

  const set = <K extends keyof Inputs>(k: K, val: Inputs[K]) => setInputs((p) => ({ ...p, [k]: val }));
  const onDayKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const next = !inputs.home;
    set('home', next);
    e.currentTarget.querySelectorAll<HTMLButtonElement>('button')[next ? 1 : 0]?.focus();
  };

  // Needle on the compass: 90° (east) points left, 180° (south) points down, 270° (west) points right.
  const a = ((inputs.azimuth - 180) * Math.PI) / 180;
  const nx = 120 + Math.sin(a) * 86; const ny = 120 + Math.cos(a) * 86;

  return (
    <section className={s.engine} aria-label="Soltara Engine: try it on an example home">
      <header className={s.head}>
        <p className={s.title}><span className={`${s.live} ${busy ? s.liveBusy : ''}`} aria-hidden="true" />Soltara Engine</p>
        <p className={s.sub}>Example: {SAMPLE_HOME.label}</p>
      </header>

      <div className={s.body}>
        <svg className={s.dial} viewBox="0 0 240 240" aria-hidden="true">
          <defs>
            <radialGradient id="eg-sun" cx="50%" cy="100%" r="70%">
              <stop offset="0" stopColor="#f06647" stopOpacity=".35" /><stop offset="1" stopColor="#f06647" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="120" cy="120" r="104" className={s.ring} />
          <path d="M16 120 A104 104 0 0 0 224 120 Z" fill="url(#eg-sun)" />
          {Array.from({ length: 72 }, (_, i) => {
            const t = (i * 5 * Math.PI) / 180; const major = i % 9 === 0;
            const r1 = major ? 90 : 96;
            return <line key={i} x1={120 + Math.cos(t) * r1} y1={120 + Math.sin(t) * r1} x2={120 + Math.cos(t) * 104} y2={120 + Math.sin(t) * 104} className={major ? s.tickMajor : s.tick} />;
          })}
          <text x="120" y="236" className={s.cardinal}>S</text>
          <text x="2" y="125" className={s.cardinal}>E</text>
          <text x="238" y="125" className={s.cardinal}>W</text>
          <text x="120" y="12" className={s.cardinal}>N</text>
          <line x1="120" y1="120" x2={nx} y2={ny} className={s.needle} />
          <circle cx={nx} cy={ny} r="7" className={s.needleTip} />
          <circle cx="120" cy="120" r="4" className={s.hub} />
          <text x="120" y="84" className={s.dialValue}>{Math.round(v.yieldK).toLocaleString('en-GB')}</text>
          <text x="120" y="104" className={s.dialUnit}>kWh per kWp a year</text>
        </svg>

        <div className={s.readout}>
          {none ? (
            <>
              <p className={s.label}>On this example</p>
              <p className={s.system}>No system pays back</p>
              <p className={s.label}>Try a different direction, pitch or usage.</p>
            </>
          ) : (
            <>
              <p className={s.label}>Best value over 20 years</p>
              <p className={s.system}>{rec.label}<span>{rec.kWp > 0 ? `${rec.kWp.toFixed(1)} kWp` : 'no panels'}</span></p>
              <p className={`fig ${s.save}`}>{money(v.low)}<i>–</i>{money(v.high)}</p>
              <p className={s.label}>estimated saving a year</p>
            </>
          )}
          <dl className={s.facts}>
            <div><dt>Generates</dt><dd className="fig">{(Math.round(v.gen / 10) * 10).toLocaleString('en-GB')} kWh</dd></div>
            <div><dt>Covered by solar</dt><dd className="fig">{Math.round(v.self)}%</dd></div>
            <div className="sr-only"><dt>Roof yield</dt><dd>{result.specificYieldKwhPerKwp} kWh per kWp a year</dd></div>
          </dl>
          <div className={s.months} aria-hidden="true">
            {rec.year.monthly.map((m, i) => (
              <span key={i} style={{ ['--h' as string]: `${(m.generationKwh / maxMonth) * 100}%` }}><i />{MONTHS[i]}</span>
            ))}
          </div>
          <p className="sr-only" aria-live="polite" aria-atomic="true">{announce}</p>
        </div>
      </div>

      <div className={s.controls}>
        <div className={s.ctl}>
          <span className={s.ctlHead}><span id="eg-az">Roof faces</span><b className="fig" aria-hidden="true">{cap(facing(inputs.azimuth))}</b></span>
          <input type="range" min={90} max={270} step={5} value={inputs.azimuth} aria-labelledby="eg-az"
            onChange={(e) => set('azimuth', Number(e.target.value))} aria-valuetext={cap(facing(inputs.azimuth))}
            style={{ ['--p' as string]: `${((inputs.azimuth - 90) / 180) * 100}%` }} />
        </div>
        <div className={s.ctl}>
          <span className={s.ctlHead}><span id="eg-pitch">Roof pitch</span><b className="fig" aria-hidden="true">{inputs.pitch}°</b></span>
          <input type="range" min={10} max={55} step={1} value={inputs.pitch} aria-labelledby="eg-pitch"
            onChange={(e) => set('pitch', Number(e.target.value))} aria-valuetext={`${inputs.pitch} degrees`}
            style={{ ['--p' as string]: `${((inputs.pitch - 10) / 45) * 100}%` }} />
        </div>
        <div className={s.ctl}>
          <span className={s.ctlHead}><span id="eg-use">Electricity a year</span><b className="fig" aria-hidden="true">{inputs.use.toLocaleString('en-GB')} kWh</b></span>
          <input type="range" min={1800} max={7000} step={100} value={inputs.use} aria-labelledby="eg-use"
            onChange={(e) => set('use', Number(e.target.value))} aria-valuetext={`${inputs.use.toLocaleString('en-GB')} kilowatt hours a year`}
            style={{ ['--p' as string]: `${((inputs.use - 1800) / 5200) * 100}%` }} />
        </div>
        <div className={s.ctl}>
          <span className={s.ctlHead}><span id="eg-day">In the daytime</span></span>
          <div className={s.seg} role="radiogroup" aria-labelledby="eg-day" onKeyDown={onDayKey}>
            <button type="button" role="radio" aria-checked={!inputs.home} tabIndex={inputs.home ? -1 : 0} onClick={() => set('home', false)}>Usually out</button>
            <button type="button" role="radio" aria-checked={inputs.home} tabIndex={inputs.home ? 0 : -1} onClick={() => set('home', true)}>Usually home</button>
          </div>
        </div>
      </div>

      <footer className={s.foot}>
        <p className={`fig ${s.stat}`}>
          <span>{result.simulatedHours.toLocaleString('en-GB')} hourly steps</span>
          <span>{result.options.length} systems</span>
          <span className={s.ms}>{ms == null ? 'runs on your device' : `${ms < 10 ? ms.toFixed(1) : Math.round(ms)} ms on your device`}</span>
        </p>
        <p>Example tariff rates and price book. Your own result uses satellite sun data for your exact postcode.</p>
      </footer>
    </section>
  );
}
