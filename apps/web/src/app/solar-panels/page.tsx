import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { sampleAssessment, sampleOnFlat, SAMPLE_HOME } from '@/lib/sample';
import { gbp, gbpRange, kwh, pct, years } from '@/lib/format';
import Icon from '../Icon';
import SunArc from '../SunArc';
import s from '../system.module.css';

export const metadata: Metadata = {
  title: 'Solar panels — what your roof could make, and what it’s worth',
  description:
    'How much solar panels could generate and save on your home, worked out from satellite sun data and an hour-by-hour simulation. Honest ranges, compared with and without a battery.',
  alternates: { canonical: '/solar-panels' },
};

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export default function SolarPanels() {
  const { assessment } = sampleAssessment();
  const flat = sampleOnFlat();
  const solar = assessment.options.find((o) => o.id === 'solar')!;
  const withBat = assessment.options.find((o) => o.id === 'solar-battery-5')!;
  const flatSolar = flat.assessment.options.find((o) => o.id === 'solar')!;
  const peak = Math.max(...solar.year.monthly.map((m) => m.generationKwh));
  const best = assessment.recommendedId;

  return (
    <>
      <section className={s.hero}>
        <div>
          <ol className={s.crumbs}><li><Link href="/">Home</Link></li><li>Systems</li><li aria-current="page">Solar panels</li></ol>
          <h1 className={s.title} data-reveal>Solar panels, sized to <span className="em em-sun">your roof,</span> not a sales target.</h1>
          <p className={s.heroLead} data-reveal style={{ ['--d' as string]: '100ms' }}>
            What your roof could make, month by month, what that’s worth on your tariff, and whether a battery adds enough to be worth it.
          </p>
          <div className={s.heroCtas} data-reveal style={{ ['--d' as string]: '180ms' }}>
            <Link className="btn btn-sun btn-arrow" href="/assessment">Check my roof</Link>
            <Link className="btn btn-quiet" href="#with-battery">With or without a battery?</Link>
          </div>
        </div>
        <div className={s.heroMedia} data-reveal-img>
          <Image src="/img/brick-gable-panels-1600.webp" alt="A red-brick house with black solar panels across its roof" fill priority sizes="(max-width: 900px) 100vw, 50vw" />
          <div className={s.heroChip}>
            <p>Example · {SAMPLE_HOME.label}</p>
            <dl>
              <div><dt>System</dt><dd className="fig">{solar.kWp.toFixed(1)} kWp</dd></div>
              <div><dt>Makes</dt><dd className="fig">{kwh(solar.year.generationKwh)}</dd></div>
              <div><dt>Saves</dt><dd className="fig">{gbpRange(solar.annualSavingGbp)}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.split}>
          <div className={s.sticky}>
            <p className="kicker" data-reveal>What decides it</p>
            <h2 className={s.h2} data-reveal style={{ ['--d' as string]: '80ms' }}>Four things set <span className="em">what your roof makes.</span></h2>
            <p className={s.lead}>We ask about all four, then use satellite sun data for your exact location instead of a national average.</p>
          </div>
          <ul className={s.factors}>
            {[
              { icon: 'sun', t: 'Direction', d: 'South is best, but east and west roofs still make most of the same energy, spread across the morning or evening.' },
              { icon: 'home', t: 'Pitch', d: 'Most British roofs sit between 30° and 45°, close to ideal. Very shallow or steep roofs lose a little.' },
              { icon: 'satellite', t: 'Where you live', d: 'Cornwall gets more sun than Caithness. We use measured sunlight for your postcode, not a guess.' },
              { icon: 'scales', t: 'Shading', d: 'Chimneys, trees and neighbouring roofs. Even light shading is allowed for in your range.' },
            ].map((f, i) => (
              <li key={f.t} data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
                <span className={s.ico}><Icon name={f.icon} size={24} /></span>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${s.dark} grain`}>
        <div className={s.darkHead}>
          <div>
            <p className="kicker kicker-light" data-reveal>Month by month</p>
            <h2 className={s.h2} data-reveal style={{ ['--d' as string]: '80ms' }}>Summer does the heavy lifting. <span className="em em-sun">Winter still counts.</span></h2>
          </div>
          <p className={s.lead}>Generation for the example home’s {solar.kWp.toFixed(1)} kWp system, from the same engine that runs your assessment.</p>
        </div>
        <figure style={{ margin: 0 }} data-reveal>
          <figcaption className={s.chartCap}><span className="mono">kWh generated each month · example home</span><span className="mono">Total {kwh(solar.year.generationKwh)}</span></figcaption>
          <div className={s.bars} role="img" aria-label={`The example system makes ${kwh(solar.year.generationKwh)} a year, most of it between April and September.`}>
            {solar.year.monthly.map((m, i) => (
              <div key={i} className={s.bar} style={{ ['--d' as string]: `${i * 50}ms` }}>
                <span style={{ height: `${(m.generationKwh / peak) * 100}%` }} />
                <small>{MONTHS[i]}</small>
              </div>
            ))}
          </div>
        </figure>
        <ul className={s.bigFigs}>
          <li data-reveal><span className="fig">{Math.round(assessment.specificYieldKwhPerKwp)}</span><span>kWh a year for every kWp of panels on this roof</span></li>
          <li data-reveal style={{ ['--d' as string]: '100ms' }}><span className="fig">{pct(solar.year.selfSufficiency)}</span><span>of the home’s electricity supplied by its own solar, with no battery</span></li>
          <li data-reveal style={{ ['--d' as string]: '200ms' }}><span className="fig">{kwh(solar.year.exportKwh)}</span><span>sent to the grid and paid for under the Smart Export Guarantee</span></li>
        </ul>
      </section>

      <section className={s.section}>
        <p className="kicker" data-reveal>Where the saving comes from</p>
        <h2 className={s.h2} data-reveal style={{ ['--d' as string]: '80ms' }}>Three ways panels <span className="em">pay you back.</span></h2>
        <ul className={s.ways}>
          <li data-reveal><h3>Use it as it’s made</h3><p>Every unit you use straight from the roof is one you don’t buy. This is where most of the saving comes from.</p></li>
          <li data-reveal style={{ ['--d' as string]: '100ms' }}><h3>Sell what you don’t use</h3><p>Surplus goes to the grid. With an MCS-certified install, a supplier pays you for it under the Smart Export Guarantee.</p></li>
          <li data-reveal style={{ ['--d' as string]: '200ms' }}><h3>Store it for the evening</h3><p>A battery keeps daytime solar for when you’re home. Whether that’s worth the extra cost depends on your home and tariff.</p></li>
        </ul>
      </section>

      <section id="with-battery" className={s.section} style={{ paddingTop: 0 }}>
        <div className={s.split}>
          <div className={s.sticky}>
            <p className="kicker" data-reveal>With or without a battery?</p>
            <h2 className={s.h2} data-reveal style={{ ['--d' as string]: '80ms' }}>The same roof, <span className="em">compared honestly.</span></h2>
            <p className={s.lead}>On the example overnight tariff a battery comes out ahead over 20 years. On a single-rate tariff, the same home is better off with panels alone. That’s why we never answer with a yes before we’ve seen your tariff.</p>
          </div>
          <div>
            <div className={s.duo} style={{ marginTop: 0 }}>
              {[solar, withBat].map((o) => (
                <article key={o.id} className={o.id === best ? `${s.card} ${s.cardBest}` : s.card} data-reveal>
                  <div className={s.cardHead}>
                    <h3>{o.label}</h3>
                    {o.id === best ? <span className={s.tag}>Best over 20 years</span> : <span className={`${s.tag} ${s.tagQuiet}`}>Overnight tariff</span>}
                  </div>
                  <dl className={s.facts}>
                    <div><dt>Saving a year</dt><dd className="fig">{gbpRange(o.annualSavingGbp)}</dd></div>
                    <div><dt>Installed</dt><dd className="fig">{gbpRange(o.installedPriceGbp)}</dd></div>
                    <div><dt>Payback</dt><dd className="fig">{years(o.paybackYears)}</dd></div>
                    <div><dt>Back over 20 yrs</dt><dd className="fig">{gbp(o.net20yrGbp)}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
            <p className={s.note}>
              On the example single-rate tariff, solar alone saves this home {gbpRange(flatSolar.annualSavingGbp)} a year and comes out
              ahead of every battery option. Example tariffs and indicative prices from Soltara’s price book, not quotes.
            </p>
          </div>
        </div>
      </section>

      <section className={s.section} style={{ paddingTop: 0 }}>
        <div className={s.split}>
          <div className={s.sticky}>
            <p className="kicker" data-reveal>Is my home suitable?</p>
            <h2 className={s.h2} data-reveal style={{ ['--d' as string]: '80ms' }}>Most are. <span className="em">Here’s what to check.</span></h2>
          </div>
          <ol className={s.check}>
            {[
              { t: 'A roof that faces anywhere but north', d: 'South is ideal. East and west work well. North-facing roofs rarely pay back, and we’ll say so.' },
              { t: 'Room for at least six or so panels', d: 'Most semis and terraces have space for a useful system. The assessment works out how many fit.' },
              { t: 'A roof in decent condition', d: 'Panels last 25 years or more. If the roof needs work soon, do it first. The installer checks at survey.' },
              { t: 'Planning rules', d: 'Most roof panels on houses are permitted development. Listed buildings, flats and some conservation areas differ.' },
            ].map((c, i) => (
              <li key={c.t} data-reveal style={{ ['--d' as string]: `${i * 70}ms` }}>
                <span className={s.checkNum}>{String(i + 1).padStart(2, '0')}</span>
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
          <h2 className={s.ctaTitle}>See what <span className="em">your roof</span> could make.</h2>
        </div>
        <Link className="btn btn-sun btn-lg btn-arrow" href="/assessment">Check my roof</Link>
      </section>
    </>
  );
}
