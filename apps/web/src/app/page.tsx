import Image from 'next/image';
import Link from 'next/link';
import { sampleAssessment, SAMPLE_ASSUMPTIONS, SAMPLE_HOME } from '@/lib/sample';
import { gbpRange, kwh, pct, years } from '@/lib/format';
import QuoteExhibit from './QuoteExhibit';
import Icon from './Icon';
import SunArc from './SunArc';
import { FAQ } from '@/lib/faq';
import s from './home.module.css';

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

const PROMISES = [
  'Independent — we don’t sell or fit anything',
  'MCS-certified installers only',
  'Three installers at most',
  'Free for homeowners',
  'Satellite sun data for your area and roof',
  'Nobody calls until you choose',
  'Every number shown as an honest range',
];

const HOMES = [
  { img: '/img/brick-gable-panels-900.webp', label: 'Semis and detached', note: 'Gable and hipped roofs' },
  { img: '/img/terrace-roofs-900.webp', label: 'Terraces', note: 'Shared walls, narrow roofs' },
  { img: '/img/brick-bungalow-900.webp', label: 'Bungalows', note: 'Low pitch, big footprint' },
  { img: '/img/new-build-row-900.webp', label: 'New builds', note: 'Often panel-ready' },
];

export default function Home() {
  const { assessment, recommended } = sampleAssessment();
  const months = recommended.year.monthly;
  const peak = Math.max(...months.map((m) => Math.max(m.generationKwh, m.loadKwh)));
  const maxNet = Math.max(...assessment.options.map((o) => o.net20yrGbp));
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.text } })),
  };

  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section className={`${s.hero} grain`}>
        <Image
          src="/img/battery-wall-2400.webp" alt="A modern home at golden hour with solar panels on the roof and a home battery on the wall"
          fill priority sizes="100vw" className={s.heroImg}
        />
        <div className={s.heroShade} aria-hidden="true" />
        <SunArc className={s.heroArc} />

        <div className={s.heroInner}>
          <p className={`kicker kicker-light ${s.heroKicker}`}>The UK Home Energy Marketplace</p>
          <h1 className={s.heroTitle}>
            <span className={s.line}><span>Find the right</span></span>
            <span className={s.line}><span>energy system</span></span>
            <span className={s.line}><span><span className="em em-sun">for your home.</span></span></span>
          </h1>

          <div className={s.heroBase}>
            <form className={s.pcPanel} action="/assessment" method="get">
              <p className={s.heroLead}>
                Compare solar, batteries and trusted installers in one place. Free, independent, and nobody calls until you choose.
              </p>
              <label htmlFor="hero-pc" className="sr-only">Your postcode</label>
              <div className={s.pcRow}>
                <span className={s.pcIcon} aria-hidden="true"><Icon name="home" size={20} /></span>
                <input id="hero-pc" name="postcode" autoComplete="postal-code" placeholder="Enter your postcode" required className={s.pcInput} />
                <button className="btn btn-sun btn-arrow" type="submit">See what you could save</button>
              </div>
              <ul className={`pills ${s.heroPills}`} aria-label="What to expect">
                <li className="pill">Free</li>
                <li className="pill">Two minutes</li>
                <li className="pill">No phone number</li>
                <li className="pill">Never sold on</li>
              </ul>
            </form>

            <aside className={s.result} aria-label="Example assessment">
              <div className={s.resultTop}>
                <span className="mono">Example · {SAMPLE_HOME.label}</span>
                <span className={s.live}><i />Engine output</span>
              </div>
              <p className={s.resultSystem}>{recommended.label}</p>
              <p className={`fig ${s.resultSave}`}>{gbpRange(recommended.annualSavingGbp)}</p>
              <p className={s.resultLabel}>estimated saving a year</p>
              <div className={s.spark} aria-hidden="true">
                {months.map((m, i) => (
                  <span key={i} style={{ height: `${(m.generationKwh / peak) * 100}%` }} />
                ))}
              </div>
              <dl className={s.resultFacts}>
                <div><dt>Installed</dt><dd className="fig">{gbpRange(recommended.installedPriceGbp)}</dd></div>
                <div><dt>Payback</dt><dd className="fig">{years(recommended.paybackYears)}</dd></div>
                <div><dt>Makes</dt><dd className="fig">{kwh(recommended.year.generationKwh)}</dd></div>
              </dl>
              <p className={s.assume}>{SAMPLE_ASSUMPTIONS}</p>
            </aside>
          </div>
        </div>
      </section>

      {/* ───────────── HOME TILES ───────────── */}
      <section className={s.tiles} aria-labelledby="tiles-title">
        <div className={s.tilesHead}>
          <h2 id="tiles-title" className="mono">Every kind of British roof</h2>
          <Link className="link" href="/assessment">Check yours</Link>
        </div>
        <ul className={s.tileRow}>
          {HOMES.map((h, i) => (
            <li key={h.label} data-reveal style={{ ['--d' as string]: `${i * 90}ms` }}>
              <Link href="/assessment" className={s.tile}>
                <span className={s.tileImg}><Image src={h.img} alt="" fill sizes="(max-width: 700px) 50vw, 25vw" /></span>
                <span className={s.tileText}><b>{h.label}</b><small>{h.note}</small></span>
                <span className={s.tileGo} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────────── PROMISE MARQUEE ───────────── */}
      <div className={s.marquee} aria-label="Our promises">
        <div className={s.marqueeTrack}>
          {[0, 1].map((k) => (
            <ul key={k} aria-hidden={k === 1 ? true : undefined}>
              {PROMISES.map((p) => <li key={p}>{p}</li>)}
            </ul>
          ))}
        </div>
      </div>

      {/* ───────────── BIG STATS ───────────── */}
      <section className={s.stats}>
        <div className={s.statsHead}>
          <p className="kicker" data-reveal>Built for trust, not for selling</p>
          <h2 className={s.h2} data-reveal style={{ ['--d' as string]: '80ms' }}>
            The comparison site that works for you, not the installer.
          </h2>
        </div>
        <ul className={s.statGrid}>
          <li data-reveal>
            <p className={s.statFig}><span className="fig" data-count="2">2</span><small>min</small></p>
            <p className={s.statLabel}>to assess your home</p>
            <p className={s.statNote}>Postcode, roof, usage and tariff. No phone number, no account.</p>
          </li>
          <li data-reveal style={{ ['--d' as string]: '90ms' }}>
            <p className={s.statFig}><span className="fig" data-count="8760">8,760</span><small>hrs</small></p>
            <p className={s.statLabel}>simulated for your year</p>
            <p className={s.statNote}>Every hour of sun, use, battery and tariff, not a rule of thumb.</p>
          </li>
          <li data-reveal style={{ ['--d' as string]: '180ms' }}>
            <p className={s.statFig}><span className="fig" data-count="3">3</span><small>max</small></p>
            <p className={s.statLabel}>installers ever see your details</p>
            <p className={s.statNote}>Only the ones you pick. Your details are never sold on.</p>
          </li>
          <li data-reveal style={{ ['--d' as string]: '270ms' }}>
            <p className={s.statFig}><span className="fig" data-count="20">20</span><small>yrs</small></p>
            <p className={s.statLabel}>of value compared</p>
            <p className={s.statNote}>So the best system is the one that gives most back, not the cheapest today.</p>
          </li>
        </ul>
      </section>

      {/* ───────────── THE ENGINE ───────────── */}
      <section id="engine" className={`${s.engine} grain`}>
        <div className={s.engineHead}>
          <div>
            <p className="kicker kicker-light" data-reveal>Under the bonnet</p>
            <h2 className={s.h2} data-reveal style={{ ['--d' as string]: '80ms' }}>
              A real engine, <span className="em em-sun">not a guess.</span>
            </h2>
          </div>
          <p className={s.engineLead} data-reveal style={{ ['--d' as string]: '160ms' }}>
            Most “solar calculators” multiply your roof by an average. Ours models your home hour by hour, then shows its working.
          </p>
        </div>

        <ol className={s.pipeline}>
          {[
            { icon: 'home', tag: 'Input', t: 'Your postcode', d: 'Located on the map, so the sun data is for your area, not a national average.' },
            { icon: 'satellite', tag: 'PVGIS · EU JRC', t: 'Satellite sun data', d: 'Nearly two decades of satellite sunlight records, worked out for your roof’s pitch and direction.' },
            { icon: 'chart', tag: '8,760 steps', t: 'Your year, hour by hour', d: 'Solar, battery, what you use and your tariff, simulated together.' },
            { icon: 'scales', tag: 'Output', t: 'Ranges, not promises', d: 'Every saving, price and payback as a range with its assumptions shown.' },
          ].map((n, i) => (
            <li key={n.t} data-reveal style={{ ['--d' as string]: `${i * 120}ms` }}>
              <span className={s.nodeIco}><Icon name={n.icon} size={22} /></span>
              <span className="mono">{String(i + 1).padStart(2, '0')} · {n.tag}</span>
              <h3>{n.t}</h3>
              <p>{n.d}</p>
            </li>
          ))}
        </ol>

        <figure className={s.trace} data-reveal>
          <figcaption>
            <span className="mono">Example home · {recommended.label}</span>
            <span className={s.traceKey}><i className={s.kGen} />Solar made <i className={s.kUse} />Home used</span>
          </figcaption>
          <div className={s.traceBars} role="img" aria-label={`Month by month, the example home makes ${kwh(recommended.year.generationKwh)} of solar a year and covers ${pct(recommended.year.selfSufficiency)} of what it uses.`}>
            {months.map((m, i) => (
              <div key={i} className={s.traceCol} style={{ ['--d' as string]: `${i * 50}ms` }}>
                <span className={s.barUse} style={{ height: `${(m.loadKwh / peak) * 100}%` }} />
                <span className={s.barGen} style={{ height: `${(m.generationKwh / peak) * 100}%` }} />
                <small>{MONTHS[i]}</small>
              </div>
            ))}
          </div>
          <dl className={s.traceFacts}>
            <div><dt>Generated a year</dt><dd className="fig">{kwh(recommended.year.generationKwh)}</dd></div>
            <div><dt>Home’s use met by solar</dt><dd className="fig">{pct(recommended.year.selfSufficiency)}</dd></div>
            <div><dt>Roof yield</dt><dd className="fig">{Math.round(assessment.specificYieldKwhPerKwp)} kWh/kWp</dd></div>
          </dl>
        </figure>
      </section>

      {/* ───────────── EVERY OPTION ───────────── */}
      <section className={s.compare}>
        <div className={s.compareIntro}>
          <p className="kicker" data-reveal>Every option, side by side</p>
          <h2 className={s.h2} data-reveal style={{ ['--d' as string]: '80ms' }}>
            You see every option, not just the one someone wants to sell you.
          </h2>
          <p className={s.lead} data-reveal style={{ ['--d' as string]: '160ms' }}>
            Solar on its own, solar with different batteries and, where your tariff allows it, a battery on its own. Then we tell
            you which gives the most back over 20 years.
          </p>
          <p className={s.note}>Example home: {SAMPLE_HOME.label}. {SAMPLE_ASSUMPTIONS} Ranges allow ±10% on sunshine and the spread of installer prices; 20-year figures allow for panels losing 0.5% a year.</p>
        </div>
        <ul className={s.options}>
          {assessment.options.map((o, i) => {
            const best = o.id === assessment.recommendedId;
            return (
              <li key={o.id} className={best ? s.optBest : s.opt} data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
                <div className={s.optHead}>
                  <h3>{o.label}</h3>
                  {best && <span className={s.bestTag}>Best value over 20 years</span>}
                </div>
                <div className={s.optBar} aria-hidden="true">
                  <span style={{ width: `${Math.max(6, (Math.max(0, o.net20yrGbp) / maxNet) * 100)}%` }} />
                </div>
                <dl className={s.optFacts}>
                  <div><dt>Saving a year</dt><dd className="fig">{gbpRange(o.annualSavingGbp)}</dd></div>
                  <div><dt>Installed</dt><dd className="fig">{gbpRange(o.installedPriceGbp)}</dd></div>
                  <div><dt>Payback</dt><dd className="fig">{years(o.paybackYears)}</dd></div>
                  <div><dt>Back over 20 yrs</dt><dd className="fig">{gbpRange(o.net20yrRangeGbp)}</dd></div>
                </dl>
                {o.kWp === 0 && <p className={s.optNote}>No panels, so the yearly saving doesn’t change with the weather. It comes from charging on the cheap overnight rate, none of it from solar.</p>}
              </li>
            );
          })}
        </ul>
      </section>

      <QuoteExhibit />

      {/* ───────────── BEFORE / AFTER + STEPS ───────────── */}
      <section id="how-it-works" className={s.how}>
        <div className={s.howHead}>
          <p className="kicker" data-reveal>How it works</p>
          <h2 className={s.h2} data-reveal style={{ ['--d' as string]: '80ms' }}>
            Buying solar used to mean a stranger on your sofa.
          </h2>
        </div>

        <div className={s.versus}>
          <div className={s.before} data-reveal>
            <p className="mono">The old way</p>
            <ul>
              <li>Your number sold to a dozen firms</li>
              <li>Three quotes in three formats, impossible to compare</li>
              <li>“Today only” prices on the doorstep</li>
              <li>No idea if the battery is even worth it</li>
            </ul>
          </div>
          <div className={s.after} data-reveal style={{ ['--d' as string]: '120ms' }}>
            <p className="mono">The Soltara way</p>
            <ul>
              <li>Your details go to three installers at most, and only the ones you pick</li>
              <li>Every quote on one standard form, line for line</li>
              <li>A price that’s out of line is easy to spot</li>
              <li>Solar on its own and with a battery, compared over 20 years</li>
            </ul>
          </div>
        </div>

        <ol className={s.steps}>
          {[
            { img: '/img/terrace-roofs-900.webp', t: 'Tell us about your home', d: 'Your postcode, roof, what you use and your tariff. About two minutes. No phone number.' },
            { img: '/img/brick-gable-panels-900.webp', t: 'See every option', d: 'Every system that suits your roof, with savings, price and payback as honest ranges.' },
            { img: '/img/installer-ladder-900.webp', t: 'Choose up to three installers', d: 'Only vetted, MCS-certified firms, quoting on one standard form. If none cover you yet, we say so.' },
            { img: '/img/new-build-row-900.webp', t: 'Pick the quote that suits you', d: 'They survey, confirm the design and fit it. Your review helps the next household.' },
          ].map((st, i) => (
            <li key={st.t} data-reveal style={{ ['--d' as string]: `${i * 100}ms` }}>
              <span className={s.stepImg}><Image src={st.img} alt="" fill sizes="(max-width: 800px) 100vw, 25vw" /></span>
              <span className={s.stepNum}>{String(i + 1).padStart(2, '0')}</span>
              <h3>{st.t}</h3>
              <p>{st.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────────── SYSTEMS ───────────── */}
      <section className={s.systems}>
        <div className={s.systemsHead}>
          <div>
            <p className="kicker" data-reveal>What we compare</p>
            <h2 className={s.h2} data-reveal style={{ ['--d' as string]: '80ms' }}>One home. Every system it could run on.</h2>
          </div>
          <Link className="btn btn-quiet btn-arrow" href="/assessment">Start with your postcode</Link>
        </div>
        <div className={s.sysGrid}>
          <Link href="/solar-panels" className={`${s.sys} ${s.sysBig}`} data-reveal-img>
            <Image src="/img/brick-gable-panels-1600.webp" alt="" fill sizes="(max-width: 900px) 100vw, 60vw" />
            <span className={s.sysText}>
              <span className="mono">Available now</span>
              <b>Solar panels</b>
              <small>What your roof could make, month by month, and what that’s worth on your tariff.</small>
            </span>
            <span className={s.sysGo} aria-hidden="true" />
          </Link>
          <Link href="/home-batteries" className={s.sys} data-reveal-img>
            <Image src="/img/battery-wall-1600.webp" alt="" fill sizes="(max-width: 900px) 100vw, 40vw" className={s.sysRight} />
            <span className={s.sysText}>
              <span className="mono">Available now</span>
              <b>Home batteries</b>
              <small>Store your own solar, or charge on cheap overnight rates.</small>
            </span>
            <span className={s.sysGo} aria-hidden="true" />
          </Link>
          <div className={`${s.sysSoon}`} data-reveal>
            <span className={s.soonIco}><Icon name="ev" size={26} /></span>
            <span className="mono">Coming to Soltara</span>
            <b>EV chargers</b>
            <small>Matched to your tariff and your solar.</small>
          </div>
          <div className={`${s.sysSoon}`} data-reveal style={{ ['--d' as string]: '100ms' }}>
            <span className={s.soonIco}><Icon name="fan" size={26} /></span>
            <span className="mono">Coming to Soltara</span>
            <b>Heat pumps</b>
            <small>Sized to your home, not a brochure.</small>
          </div>
        </div>
      </section>

      {/* ───────────── PROMISE ───────────── */}
      <section className={s.promise}>
        <Image src="/img/dormer-roof-sky-2400.webp" alt="" fill sizes="100vw" className={s.promiseImg} />
        <div className={s.promiseShade} aria-hidden="true" />
        <div className={s.promiseText}>
          <Icon name="lock" size={34} />
          <h2 className={s.promiseTitle} data-reveal>
            Your number goes to three installers at most, and only the ones you pick.
          </h2>
          <p data-reveal style={{ ['--d' as string]: '120ms' }}>We never sell your details. Nobody calls until you ask them to.</p>
        </div>
      </section>

      {/* ───────────── INSTALLERS ───────────── */}
      <section className={s.installers}>
        <div className={s.installersMedia} data-reveal-img>
          <Image src="/img/installer-ladder-1600.webp" alt="An installer in a hard hat fitting solar panels" fill sizes="(max-width: 900px) 100vw, 50vw" />
          <span className={s.verified}><Icon name="badge" size={22} />Soltara Verified</span>
        </div>
        <div className={s.installersText}>
          <p className="kicker" data-reveal>For installers</p>
          <h2 className={s.h2} data-reveal style={{ ['--d' as string]: '80ms' }}>
            Quote for homeowners who are ready.
          </h2>
          <p className={s.lead} data-reveal style={{ ['--d' as string]: '160ms' }}>
            Every homeowner has already had their roof, usage and tariff assessed, and chose you. No shared leads, no cold lists.
            Founding installers join free and pay nothing until we start booking surveys for them.
          </p>
          <ul className={s.instFacts} data-reveal style={{ ['--d' as string]: '220ms' }}>
            <li><b>£0</b><span>to join</span></li>
            <li><b>0</b><span>lead charges at launch</span></li>
            <li><b>None</b><span>contract term</span></li>
          </ul>
          <Link className="btn btn-primary btn-arrow" href="/for-installers">Join as a founding installer</Link>
        </div>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section id="faq" className={s.faq}>
        <div className={s.faqHead}>
          <p className="kicker" data-reveal>Questions answered</p>
          <h2 className={s.h2} data-reveal style={{ ['--d' as string]: '80ms' }}>Straight answers, before you ask.</h2>
          <p className={s.lead}>Anything else, the assessment shows its working on every number.</p>
        </div>
        <div className={s.faqList}>
          {FAQ.map((f, i) => (
            <details key={f.q} className={s.faqItem} open={i === 0}>
              <summary><span>{f.q}</span><i aria-hidden="true" /></summary>
              <div className={s.faqBody}>{f.a}</div>
            </details>
          ))}
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      </section>

      {/* ───────────── FINAL CTA ───────────── */}
      <section className={`${s.final} band-blue grain`}>
        <SunArc className={s.finalArc} />
        <div className={s.finalInner}>
          <p className="kicker kicker-blue">Free · two minutes · no phone number</p>
          <h2 className={s.finalTitle}>Find out what <span className="em">your roof</span> could do.</h2>
          <form className={s.finalForm} action="/assessment" method="get">
            <label htmlFor="final-pc" className="sr-only">Your postcode</label>
            <input id="final-pc" name="postcode" autoComplete="postal-code" placeholder="Enter your postcode" required className={s.pcInput} />
            <button className="btn btn-sun btn-lg btn-arrow" type="submit">See what you could save</button>
          </form>
        </div>
        <ol className={s.finalList}>
          <li><span>01</span><b>Every option for your roof</b><small>Solar alone, with each battery size, and battery only where your tariff suits it.</small></li>
          <li><span>02</span><b>Savings, price and payback as ranges</b><small>With every assumption listed underneath.</small></li>
          <li><span>03</span><b>Quotes only if you want them</b><small>From up to three installers you choose. Nobody calls first.</small></li>
        </ol>
      </section>
    </>
  );
}
