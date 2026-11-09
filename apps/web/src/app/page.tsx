import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { sampleAssessment, SAMPLE_HOME } from '@/lib/sample';
import { gbp, gbpRange, pct, years } from '@/lib/format';
import Engine from './Engine';
import QuoteExhibit from './QuoteExhibit';
import s from './home.module.css';

export const metadata: Metadata = { alternates: { canonical: '/' } };

const PROMISES = [
  { title: 'Independent', body: 'We don’t sell, fit or finance anything.' },
  { title: 'MCS-certified only', body: 'Every installer checked by us, every year.' },
  { title: 'Three installers at most', body: 'Only the ones you choose see your details.' },
  { title: 'Free for homeowners', body: 'Installers pay us. You never do.', href: '/how-we-make-money', link: 'How we make money' },
];

const STEPS = [
  { title: 'Tell us about your home', body: 'Your postcode, roof, what you use and your tariff. About two minutes, and no phone number.' },
  { title: 'See every option', body: 'Every system that suits your roof, with saving, price and payback as honest ranges.' },
  { title: 'Choose up to three installers', body: 'Vetted, MCS-certified firms that cover your area, quoting on one standard form.' },
  { title: 'Pick the quote that suits you', body: 'They survey, confirm the design and fit it. Your review helps the next household.' },
];

const FAQ = [
  {
    q: 'Is Soltara really free?',
    a: 'Yes. You never pay Soltara anything, whether or not you go ahead. Installers pay us when we book a site survey for them, and no installer can pay to be recommended or shown first.',
  },
  {
    q: 'Where do the numbers come from?',
    a: 'Your postcode places your home on the map, and satellite sun data from the EU’s PVGIS service gives the sunlight your roof receives. The Soltara Engine then simulates every hour of a year for each system and shows the result as a range, with every assumption listed.',
  },
  {
    q: 'Will installers start calling me?',
    a: 'No. Nobody sees your details until you choose them, and then only up to three installers you picked. Nobody calls until you ask them to.',
  },
  {
    q: 'Do I need a battery?',
    a: 'Not always. We compare solar on its own, solar with different batteries and, where your tariff allows it, a battery on its own. Then we show which gives the most back over 20 years, including when the answer is no battery.',
  },
  {
    q: 'Do you cover my area?',
    a: 'The assessment works for any home in Great Britain. We are adding vetted installers region by region; if none cover your postcode yet, we tell you so rather than passing you to someone who doesn’t.',
  },
  {
    q: 'Can you help with finance or grants?',
    a: 'We don’t lend money, arrange finance or decide grant eligibility. We explain schemes such as the Warm Homes Loan Scheme in plain English so you know what to ask about.',
    href: '/warm-homes-loans',
  },
];

export default function Home() {
  const { assessment, recommended } = sampleAssessment();
  const best = Math.max(...assessment.options.map((o) => o.net20yrGbp));
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      {/* HERO — graphite, the headline at full scale beside the live engine */}
      <section className={`${s.hero} grain`} data-surface="dark">
        <div className={s.heroBackdrop} aria-hidden="true">
          <Image src="/img/brick-gable-panels-2400.webp" alt="" fill loading="lazy" quality={45} sizes="(max-width: 1100px) 100vw, 70vw" className={s.heroBackdropImg} />
        </div>
        <div className={s.heroGrid}>
          <div className={s.heroText}>
            <p className="kicker kicker-light" data-rise>The UK Home Energy Marketplace</p>
            <h1 className={s.heroTitle} data-rise style={{ ['--i' as string]: 1 }}>
              Find the right energy system <em>for your home.</em>
            </h1>
            <p className={s.heroLead} data-rise style={{ ['--i' as string]: 2 }}>
              Compare solar, batteries and trusted installers in one place. Free, independent, and nobody calls until you choose.
            </p>
            <form className={s.pcForm} action="/assessment" method="get" data-rise style={{ ['--i' as string]: 3 }}>
              <label htmlFor="hero-pc" className="sr-only">Your postcode</label>
              <div className={s.pcRow}>
                <input id="hero-pc" name="postcode" autoComplete="postal-code" placeholder="Postcode" required className={s.pcInput} />
                <button className="btn btn-sun btn-arrow" type="submit">See what you could save</button>
              </div>
              <ul className={s.pcNote} aria-label="What to expect"><li>Free</li><li>Two minutes</li><li>No phone number</li><li>Never sold on</li></ul>
            </form>
          </div>
          <div className={s.heroEngine} data-rise style={{ ['--i' as string]: 2 }}>
            <Engine initial={assessment} />
          </div>
        </div>

        <ul className={s.promises} aria-label="Our promises">
          {PROMISES.map((p, i) => (
            <li key={p.title} data-reveal style={{ ['--i' as string]: i }}>
              <span className={`fig ${s.index}`}>0{i + 1}</span>
              <strong>{p.title}</strong>
              <span>{p.body}</span>
              {p.href && <Link className={s.promiseLink} href={p.href}>{p.link}</Link>}
            </li>
          ))}
        </ul>
      </section>

      {/* MEASURED — the roof photo, annotated as the engine sees it */}
      <section className={s.measured}>
        <div className={s.measuredMedia} data-reveal>
          <Image src="/img/brick-gable-panels-2400.webp" alt="A red-brick house with a row of black solar panels across its roof"
            fill sizes="(max-width: 900px) 100vw, 62vw" className={s.cover} />
          <svg className={s.overlay} viewBox="0 0 1000 666" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <polygon className={s.roofZone} points="302,238 800,140 681,297 161,380" />
          </svg>
          <p className={s.tag} style={{ top: '18%', left: '6%' }}><span className="fig">{recommended.design.panelCount} panels · {recommended.kWp.toFixed(1)} kWp</span> on the example home</p>
          <p className={s.tag} style={{ bottom: '10%', right: '6%' }}><span className="fig">{SAMPLE_HOME.roof.pitchDeg}° · south</span> example pitch and direction</p>
        </div>
        <div className={s.measuredText}>
          <p className="kicker" data-reveal>Measured, not guessed</p>
          <h2 className={s.h2} data-reveal style={{ ['--i' as string]: 1 }}>Your roof, worked out from satellite sun data.</h2>
          <p className={s.lead} data-reveal style={{ ['--i' as string]: 2 }}>
            Your postcode places your home on the map. Satellite records from the EU’s PVGIS service give the sun your roof
            actually receives, after the hills and horizon around it. Then the engine simulates every hour of a full year.
          </p>
          <dl className={s.stats} data-reveal style={{ ['--i' as string]: 3 }}>
            <div><dt>Hours simulated per system</dt><dd className="fig" data-count="8760">8,760</dd></div>
            <div><dt>Systems compared</dt><dd className="fig" data-count={assessment.options.length}>{assessment.options.length}</dd></div>
            <div><dt>Installers who see your details</dt><dd className="fig">≤3</dd></div>
          </dl>
        </div>
      </section>

      {/* COMPARE — every option, including the ones we don't recommend */}
      <section className={s.compare}>
        <header className={s.sectionHead}>
          <div>
            <p className="kicker" data-reveal>Every option, side by side</p>
            <h2 className={s.h2} data-reveal style={{ ['--i' as string]: 1 }}>Every option, <em>not just the one</em> someone wants to sell you.</h2>
          </div>
          <p className={s.lead} data-reveal style={{ ['--i' as string]: 2 }}>
            The full result for the example home. Solar alone, solar with three battery sizes, and a battery on a cheap
            overnight rate. The bar shows the central case for what each gives back over 20 years; the figure beside it is the range.
          </p>
        </header>
        <div className={s.tableWrap} data-reveal>
          <table className={s.table}>
            <caption className="sr-only">Options for the example home</caption>
            <thead>
              <tr>
                <th scope="col">System</th>
                <th scope="col">Saving a year</th>
                <th scope="col">Installed price</th>
                <th scope="col">Pays back in</th>
                <th scope="col">Use covered by solar</th>
                <th scope="col">Back over 20 years</th>
              </tr>
            </thead>
            <tbody>
              {assessment.options.map((o) => {
                const isBest = o.id === assessment.recommendedId;
                return (
                  <tr key={o.id} className={isBest ? s.rowBest : undefined}>
                    <th scope="row">
                      {o.label}
                      {isBest && <span className={s.bestTag}>Best value over 20 years</span>}
                    </th>
                    <td data-label="Saving a year" className="fig">{gbpRange(o.annualSavingGbp)}</td>
                    <td data-label="Installed price" className="fig">{gbpRange(o.installedPriceGbp)}</td>
                    <td data-label="Pays back in" className="fig">{years(o.paybackYears)}</td>
                    <td data-label="Use covered by solar" className="fig">{o.kWp > 0 ? pct(o.year.selfSufficiency) : 'None'}</td>
                    <td data-label="Back over 20 years" className={s.barCell}>
                      <span className={s.bar}>
                        <i style={{ ['--w' as string]: `${Math.max(0, o.net20yrGbp / best) * 100}%` }} />
                        <b className="fig" title={`Central case ${gbp(o.net20yrGbp)}`}>{gbpRange(o.net20yrRangeGbp)}</b>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className={s.tableNote}>
            Example home, example tariff rates and price book. Ranges allow for weather and price differences. A battery on its
            own saves by charging on a cheap overnight rate, so it uses none of your own solar.
          </p>
        </div>
      </section>

      <QuoteExhibit />

      {/* HOW IT WORKS — four steps along one drawn line */}
      <section id="how-it-works" className={`${s.steps} grain`} data-surface="dark">
        <header className={s.sectionHead}>
          <div>
            <p className="kicker kicker-light" data-reveal>How it works</p>
            <h2 className={s.h2} data-reveal style={{ ['--i' as string]: 1 }}>Four steps. You decide every one.</h2>
          </div>
          <div className={s.stepsAction} data-reveal style={{ ['--i' as string]: 2 }}>
            <Link className="btn btn-ghost btn-arrow" href="/assessment">Start with your postcode</Link>
          </div>
        </header>
        <ol className={s.stepList} data-reveal>
          {STEPS.map((st, i) => (
            <li key={st.title} style={{ ['--i' as string]: i }}>
              <span className={`fig ${s.stepNum}`}>0{i + 1}</span>
              <h3>{st.title}</h3>
              <p>{st.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* PROMISE — the privacy line, over open sky */}
      <section className={s.promise} data-surface="dark">
        <Image src="/img/dormer-roof-sky-2400.webp" alt="" fill sizes="100vw" className={s.promiseImg} />
        <div className={s.promiseText}>
          <p className="kicker kicker-light" data-reveal>Our privacy promise</p>
          <blockquote className={s.promiseTitle} data-reveal style={{ ['--i' as string]: 1 }}>
            Your details go to three installers at most, <em>and only the ones you pick.</em>
          </blockquote>
          <p className={s.promiseSub} data-reveal style={{ ['--i' as string]: 2 }}>We never sell your details. Nobody calls until you ask them to.</p>
        </div>
      </section>

      {/* INSTALLERS */}
      <section className={s.installers}>
        <div className={s.installersText}>
          <p className="kicker" data-reveal>For installers</p>
          <h2 className={s.h2} data-reveal style={{ ['--i' as string]: 1 }}>Quote for homeowners who are ready.</h2>
          <p className={s.lead} data-reveal style={{ ['--i' as string]: 2 }}>
            Every homeowner has already had their roof, usage and tariff assessed, and chose you. No shared leads, no cold
            lists. Founding installers join free and pay nothing until we are booking surveys for them.
          </p>
          <ul className="pills" aria-label="Founding installer terms" data-reveal style={{ ['--i' as string]: 3 }}>
            <li className="pill pill-day">Free to join</li>
            <li className="pill pill-day">No lead charges at launch</li>
            <li className="pill pill-day">No contract term</li>
          </ul>
          <p data-reveal style={{ ['--i' as string]: 4 }}><Link className="btn btn-primary btn-arrow" href="/for-installers">Join as a founding installer</Link></p>
        </div>
        <div className={s.installersMedia} data-reveal>
          <Image src="/img/installer-ladder-1600.webp" alt="An installer in a hard hat fitting solar panels" fill sizes="(max-width: 900px) 100vw, 50vw" className={s.cover} />
        </div>
      </section>

      {/* FAQ */}
      <section className={s.faq}>
        <div className={s.faqHead}>
          <p className="kicker" data-reveal>Questions</p>
          <h2 className={s.h2} data-reveal style={{ ['--i' as string]: 1 }}>What people ask before they start.</h2>
          <aside className={s.faqCard} data-reveal style={{ ['--i' as string]: 2 }}>
            <p className="fig">£0 · ≤3 · No paid placement</p>
            <p>Still weighing it up? Here is exactly how Soltara is paid, in plain English.</p>
            <Link className="btn btn-quiet btn-arrow" href="/how-we-make-money">How we make money</Link>
          </aside>
        </div>
        <div className={s.faqList}>
          {FAQ.map((f, i) => (
            <details key={f.q} className={s.faqItem} data-reveal style={{ ['--i' as string]: i }}>
              <summary>{f.q}<span aria-hidden="true" /></summary>
              <p>{f.a}{f.href && <> <Link href={f.href}>Read more</Link>.</>}</p>
            </details>
          ))}
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, '\\u003c') }} />
      </section>

      {/* FINAL CTA */}
      <section className={`${s.final} band-blue grain`}>
        <div className={s.finalMain}>
          <p className="kicker kicker-blue" data-reveal>Your turn</p>
          <h2 className={s.finalTitle} data-reveal style={{ ['--i' as string]: 1 }}>Find out what <em>your roof</em> could do.</h2>
          <p data-reveal style={{ ['--i' as string]: 2 }}><Link className="btn btn-sun btn-lg btn-arrow" href="/assessment">See what your home could save</Link></p>
        </div>
        <dl className={s.finalProof} data-reveal style={{ ['--i' as string]: 3 }}>
          <div><dt>To check your home</dt><dd className="fig">2 min</dd></div>
          <div><dt>Cost to you</dt><dd className="fig">£0</dd></div>
          <div><dt>Phone number needed</dt><dd className="fig">None</dd></div>
        </dl>
      </section>
    </>
  );
}
