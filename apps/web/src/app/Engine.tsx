'use client';

import { assess, OVERNIGHT_EXAMPLE, type Assessment, type HomeProfile } from '@soltara/engine';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SAMPLE_HOME } from '@/lib/sample';
import s from './engine.module.css';

/**
 * The Soltara Engine, live. Every turn of a control re-runs the real assessment engine in the visitor's
 * browser: 8,760 hourly steps for each system option, on example tariff rates. The compute time shown is
 * measured, not decorative. Nothing here is sent anywhere.
 */

type Inputs = { azimuth: number; pitch: number; use: number; home: boolean };
const START: Inputs = { azimuth: SAMPLE_HOME.roof.azimuthDeg, pitch: SAMPLE_HOME.roof.pitchDeg, use: SAMPLE_HOME.annualKwh, home: false };
const MONTHS = 'JFMAMJJASOND'.split('');

function run(i: Inputs): Assessment {
  const home: HomeProfile = {
    ...SAMPLE_HOME,
    roof: { ...SAMPLE_HOME.roof, azimuthDeg: i.azimuth, pitchDeg: i.pitch },
    annualKwh: i.use,
    occupancy: i.home ? 'home_daytime' : 'out_daytime',
  };
  return assess(home, OVERNIGHT_EXAMPLE);
}

function facing(az: number): string {
  const names = ['east', 'east-south-east', 'south-east', 'south-south-east', 'south', 'south-south-west', 'south-west', 'west-south-west', 'west'];
  return names[Math.round((az - 90) / 22.5)] ?? 'south';
}

/** Ease a number towards its target so readouts glide rather than jump. */
function useTween(value: number, ms = 520): number {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = from.current;
    if (reduce || start === value) { from.current = value; setShown(value); return; }
    const t0 = performance.now(); let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms); const e = 1 - Math.pow(1 - k, 3);
      const v = start + (value - start) * e;
      from.current = v; setShown(v);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return shown;
}

const money = (n: number) => `£${Math.round(n).toLocaleString('en-GB')}`;

export default function Engine({ initial }: { initial: Assessment }) {
  const [inputs, setInputs] = useState<Inputs>(START);
  const [result, setResult] = useState<Assessment>(initial);
  const [ms, setMs] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  // Re-run on the next frame so the control stays responsive while dragging.
  useEffect(() => {
    setBusy(true);
    const raf = requestAnimationFrame(() => {
      const t0 = performance.now();
      const r = run(inputs);
      setMs(performance.now() - t0);
      setResult(r); setBusy(false);
    });
    return () => cancelAnimationFrame(raf);
  }, [inputs]);

  const rec = result.options.find((o) => o.id === result.recommendedId) ?? result.options[0]!;
  const lowSave = useTween(rec.annualSavingGbp.low);
  const highSave = useTween(rec.annualSavingGbp.high);
  const gen = useTween(rec.year.generationKwh);
  const self = useTween(rec.year.selfSufficiency * 100);
  const yieldK = useTween(result.specificYieldKwhPerKwp);
  const maxMonth = useMemo(() => Math.max(...rec.year.monthly.map((m) => m.generationKwh), 1), [rec]);
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setInputs((p) => ({ ...p, [k]: v }));

  // Needle on the compass: 90° (east) points left, 180° (south) points down, 270° (west) points right.
  const a = ((inputs.azimuth - 180) * Math.PI) / 180;
  const nx = 120 + Math.sin(a) * 86; const ny = 120 + Math.cos(a) * 86;
  const steps = result.options.length * 8760;

  return (
    <section className={s.engine} aria-label="Soltara Engine: try it on an example home">
      <header className={s.head}>
        <p className={s.title}><span className={`${s.live} ${busy ? s.liveBusy : ''}`} aria-hidden="true" />Soltara Engine</p>
        <p className={s.sub}>Example: {SAMPLE_HOME.label}</p>
      </header>

      <div className={s.body}>
        <figure className={s.dial} aria-hidden="true">
          <svg viewBox="0 0 240 240">
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
            <text x="120" y="232" className={s.cardinal}>S</text>
            <text x="6" y="124" className={s.cardinal}>E</text>
            <text x="234" y="124" className={s.cardinal}>W</text>
            <text x="120" y="14" className={s.cardinal}>N</text>
            <line x1="120" y1="120" x2={nx} y2={ny} className={s.needle} />
            <circle cx={nx} cy={ny} r="7" className={s.needleTip} />
            <circle cx="120" cy="120" r="4" className={s.hub} />
            <text x="120" y="84" className={s.dialValue}>{Math.round(yieldK).toLocaleString('en-GB')}</text>
            <text x="120" y="102" className={s.dialUnit}>kWh per kWp a year</text>
          </svg>
          <figcaption className="sr-only">Roof direction dial</figcaption>
        </figure>

        <div className={s.readout} aria-live="polite">
          <p className={s.label}>Best value over 20 years</p>
          <p className={s.system}>{rec.label}<span>{rec.kWp > 0 ? `${rec.kWp.toFixed(1)} kWp` : 'no panels'}</span></p>
          <p className={`fig ${s.save}`}>{money(lowSave)}<i>–</i>{money(highSave)}</p>
          <p className={s.label}>estimated saving a year</p>
          <dl className={s.facts}>
            <div><dt>Generates</dt><dd className="fig">{(Math.round(gen / 10) * 10).toLocaleString('en-GB')} kWh</dd></div>
            <div><dt>Own solar used</dt><dd className="fig">{Math.round(self)}%</dd></div>
          </dl>
          <div className={s.months} aria-hidden="true">
            {rec.year.monthly.map((m, i) => (
              <span key={i} style={{ ['--h' as string]: `${(m.generationKwh / maxMonth) * 100}%` }}><i />{MONTHS[i]}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={s.controls}>
        <label className={s.ctl}>
          <span className={s.ctlHead}><span>Roof faces</span><b className="fig">{facing(inputs.azimuth).replace(/^./, (c) => c.toUpperCase())}</b></span>
          <input type="range" min={90} max={270} step={5} value={inputs.azimuth} onChange={(e) => set('azimuth', Number(e.target.value))}
            style={{ ['--p' as string]: `${((inputs.azimuth - 90) / 180) * 100}%` }} aria-valuetext={`Faces ${facing(inputs.azimuth)}`} />
        </label>
        <label className={s.ctl}>
          <span className={s.ctlHead}><span>Roof pitch</span><b className="fig">{inputs.pitch}°</b></span>
          <input type="range" min={10} max={55} step={1} value={inputs.pitch} onChange={(e) => set('pitch', Number(e.target.value))}
            style={{ ['--p' as string]: `${((inputs.pitch - 10) / 45) * 100}%` }} />
        </label>
        <label className={s.ctl}>
          <span className={s.ctlHead}><span>Electricity a year</span><b className="fig">{inputs.use.toLocaleString('en-GB')} kWh</b></span>
          <input type="range" min={1800} max={7000} step={100} value={inputs.use} onChange={(e) => set('use', Number(e.target.value))}
            style={{ ['--p' as string]: `${((inputs.use - 1800) / 5200) * 100}%` }} />
        </label>
        <fieldset className={s.seg}>
          <legend>In the daytime</legend>
          <button type="button" aria-pressed={!inputs.home} onClick={() => set('home', false)}>Usually out</button>
          <button type="button" aria-pressed={inputs.home} onClick={() => set('home', true)}>Usually home</button>
        </fieldset>
      </div>

      <footer className={s.foot}>
        <p className="fig">
          {steps.toLocaleString('en-GB')} hourly steps · {result.options.length} systems ·{' '}
          <span className={s.ms}>{ms == null ? 'ready' : `${ms < 10 ? ms.toFixed(1) : Math.round(ms)} ms on your device`}</span>
        </p>
        <p>Example tariff rates and price book. Your own result uses satellite sun data for your exact postcode.</p>
      </footer>
    </section>
  );
}
