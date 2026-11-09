import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { sampleAssessment, sampleOnFlat, SAMPLE_HOME } from '@/lib/sample';
import { gbp, gbpRange, years } from '@/lib/format';
import Icon from '../Icon';
import SunArc from '../SunArc';
import s from '../system.module.css';

export const metadata: Metadata = {
  title: 'Home batteries — when they pay, and when they don’t',
  description:
    'Whether a home battery is worth it depends on your home and tariff. See solar-only, solar with 5, 10 and 13.5 kWh batteries, and battery-only compared over 20 years.',
  alternates: { canonical: '/home-batteries' },
};

export default function HomeBatteries() {
  const night = sampleAssessment();
  const flat = sampleOnFlat();
  const nightOpts = night.assessment.options;
  const maxNet = Math.max(...nightOpts.map((o) => o.net20yrGbp));
  const batOnly = nightOpts.find((o) => o.id === 'battery-10');
  const flatBest = flat.recommended;
  const nightBest = night.recommended;

  return (
    <>
      <section className={s.hero}>
        <div>
          <ol className={s.crumbs}><li><Link href="/">Home</Link></li><li>Systems</li><li aria-current="page">Home batteries</li></ol>
          <h1 className={s.title} data-reveal>A battery is worth it <span className="em em-sun">until it isn’t.</span></h1>
          <p className={s.heroLead} data-reveal style={{ ['--d' as string]: '100ms' }}>
            We size it against your home and your tariff, show you the version without one, and let the 20-year numbers decide.
          </p>
          <div className={s.heroCtas} data-reveal style={{ ['--d' as string]: '180ms' }}>
            <Link className="btn btn-sun btn-arrow" href="/assessment">Check my home</Link>
            <Link className="btn btn-quiet" href="#sizes">Compare sizes</Link>
          </div>
        </div>
        <div className={s.heroMedia} data-reveal-img>
          <Image src="/img/battery-wall-1600.webp" alt="A home battery and inverter fitted to the outside wall of a modern house" fill priority sizes="(max-width: 900px) 100vw, 50vw" style={{ objectPosition: '75% 50%' }} />
          <div className={s.heroChip}>
            <p>Example · {SAMPLE_HOME.label} · overnight tariff</p>
            <dl>
              <div><dt>Best option</dt><dd className="fig">{nightBest.design.battery ? `${nightBest.design.battery.capacityKwh} kWh` : 'No battery'}</dd></div>
              <div><dt>Saves</dt><dd className="fig">{gbpRange(nightBest.annualSavingGbp)}</dd></div>
              <div><dt>Payback</dt><dd className="fig">{years(nightBest.paybackYears)}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className={s.section} style={{ paddingTop: 0 }}>
        <p className="kicker" data-reveal>How a battery earns its keep</p>
        <h2 className={s.h2} data-reveal style={{ ['--d' as string]: '80ms' }}>Two jobs. <span className="em">Your tariff decides which matters.</span></h2>
        <ul className={s.ways}>
          <li data-reveal><h3>Keep your own solar</h3><p>Daytime surplus is stored and used in the evening instead of being sold cheaply to the grid.</p></li>
          <li data-reveal style={{ ['--d' as string]: '100ms' }}><h3>Buy cheap, use later</h3><p>On a tariff with a cheap overnight rate, the battery fills up at night and runs the house through the expensive hours.</p></li>
          <li data-reveal style={{ ['--d' as string]: '200ms' }}><h3>Counted honestly</h3><p>Grid power stored overnight is never counted as your own solar. You see the two separately, every time.</p></li>
        </ul>
      </section>

      <section className={`${s.dark} grain`}>
        <div className={s.darkHead}>
          <div>
            <p className="kicker kicker-light" data-reveal>Same home, two tariffs</p>
            <h2 className={s.h2} data-reveal style={{ ['--d' as string]: '80ms' }}>Two tariffs, <span className="em em-sun">two different answers.</span></h2>
          </div>
          <p className={s.lead}>The example home, run through the engine twice. Only the tariff changes.</p>
        </div>
        <ul className={s.bigFigs}>
          <li data-reveal>
            <span className="fig">{flatBest.design.battery ? `${flatBest.design.battery.capacityKwh} kWh` : 'No battery'}</span>
            <span>is the best value over 20 years on a single-rate tariff ({gbp(flatBest.net20yrGbp)} back).</span>
          </li>
          <li data-reveal style={{ ['--d' as string]: '100ms' }}>
            <span className="fig">{nightBest.design.battery ? `${nightBest.design.battery.capacityKwh} kWh` : 'No battery'}</span>
            <span>is the best value on a cheap overnight tariff ({gbp(nightBest.net20yrGbp)} back).</span>
          </li>
          {batOnly && (
            <li data-reveal style={{ ['--d' as string]: '200ms' }}>
              <span className="fig">{gbpRange(batOnly.annualSavingGbp)}</span>
              <span>a year from a 10 kWh battery with no panels at all, charging overnight.</span>
            </li>
          )}
        </ul>
      </section>

      <section id="sizes" className={s.section}>
        <div className={s.split}>
          <div className={s.sticky}>
            <p className="kicker" data-reveal>Bigger isn’t better</p>
            <h2 className={s.h2} data-reveal style={{ ['--d' as string]: '80ms' }}>Every size, <span className="em">ranked by what it gives back.</span></h2>
            <p className={s.lead}>Past a point, extra capacity sits half-empty. The bar shows value over 20 years, after the cost of the system.</p>
            <p className={s.note}>Example home on the overnight tariff. Indicative prices from Soltara’s price book, not quotes.</p>
          </div>
          <ul className={s.sizes}>
            {nightOpts.map((o, i) => {
              const best = o.id === night.assessment.recommendedId;
              return (
                <li key={o.id} className={best ? `${s.size} ${s.sizeBest}` : s.size} data-reveal style={{ ['--d' as string]: `${i * 70}ms` }}>
                  <b>{o.design.battery ? `${o.design.battery.capacityKwh} kWh` : 'No battery'}<small style={{ display: 'block', fontFamily: 'var(--f-text)', fontSize: '.85rem', fontWeight: 500, letterSpacing: 0, color: 'var(--slate-2)' }}>{o.kWp > 0 ? 'with solar' : 'battery only'}</small></b>
                  <span className={s.track}><span style={{ width: `${Math.max(6, (Math.max(0, o.net20yrGbp) / maxNet) * 100)}%` }} /></span>
                  <span className={s.sizeFig}><span className="fig">{gbp(o.net20yrGbp)}</span><small>back over 20 yrs</small></span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className={s.section} style={{ paddingTop: 0 }}>
        <div className={s.split}>
          <div className={s.sticky}>
            <p className="kicker" data-reveal>Reading a battery quote</p>
            <h2 className={s.h2} data-reveal style={{ ['--d' as string]: '80ms' }}>Four lines <span className="em">worth checking.</span></h2>
            <p className={s.lead}>Every Soltara quote puts these on the same line, so they’re easy to compare.</p>
          </div>
          <ol className={s.check}>
            {[
              { t: 'Usable capacity, not total', d: 'A battery can’t use every last kWh. Compare the usable figure, in kWh.' },
              { t: 'Power, in kW', d: 'How much it can deliver at once. Too low and the kettle and oven still pull from the grid.' },
              { t: 'Warranty, in years and cycles', d: 'Ten years is common. Check what capacity it promises to keep by the end.' },
              { t: 'Hybrid or AC-coupled', d: 'Fitting with new panels usually suits a hybrid inverter. Adding to existing panels often means AC-coupled.' },
            ].map((c, i) => (
              <li key={c.t} data-reveal style={{ ['--d' as string]: `${i * 70}ms` }}>
                <span className={s.checkNum}><Icon name="check" size={18} /></span>
                <div><b>{c.t}</b><p>{c.d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${s.cta} band-blue grain`}>
        <SunArc className={s.ctaArc} />
        <div>
          <p className="kicker kicker-blue">Free · two minutes · no phone number</p>
          <h2 className={s.ctaTitle}>Find out if a battery <span className="em">pays for you.</span></h2>
        </div>
        <Link className="btn btn-sun btn-lg btn-arrow" href="/assessment">Check my home</Link>
      </section>
    </>
  );
}
