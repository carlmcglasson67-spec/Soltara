import Image from 'next/image';
import Link from 'next/link';
import { sampleAssessment, SAMPLE_HOME } from '@/lib/sample';
import { gbpRange, kwh, pct, years } from '@/lib/format';
import QuoteExhibit from './QuoteExhibit';
import s from './home.module.css';

export default function Home() {
  const { assessment, recommended } = sampleAssessment();

  return (
    <>
      {/* HERO: the headline beside a real roof, with the assessment drawn onto it */}
      <section className={s.hero}>
        <div className={s.heroText}>
          <h1 className={s.heroTitle}>Find the right energy system for your home.</h1>
          <p className={s.heroLead}>
            Compare solar, batteries and trusted installers in one place. Free, independent, and nobody calls until you choose.
          </p>
          <form className={s.pcForm} action="/assessment" method="get">
            <label htmlFor="hero-pc" className={s.pcLabel}>Your postcode</label>
            <div className={s.pcRow}>
              <input id="hero-pc" name="postcode" autoComplete="postal-code" placeholder="e.g. CA14 2XX" required className={s.pcInput} />
              <button className="btn btn-primary" type="submit">See what you could save</button>
            </div>
            <p className={s.heroSmall}>Free and takes two minutes. No phone number, and your details are never sold.</p>
          </form>
        </div>

        <div className={s.heroMedia}>
          <div className={s.photo}>
          <Image
            src="/img/brick-gable-panels-2400.webp"
            alt="A red-brick house with a row of black solar panels across its roof"
            fill priority sizes="(max-width: 900px) 100vw, 60vw"
            className={s.heroImg}
          />
          {/* Overlay in the photo's own coordinates (1000 x 666), anchored like the image */}
          <svg className={s.overlay} viewBox="0 0 1000 666" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <polygon className={s.roofZone} points="302,238 800,140 681,297 161,380" />
            <line className={s.roofTick} x1="161" y1="380" x2="302" y2="238" />
          </svg>
          <p className={s.roofLabel}>
            <span className="fig">{recommended.kWp.toFixed(1)} kWp</span> on a south roof at 35°
          </p>
          </div>

          <aside className={s.card} aria-label="Example assessment">
            <p className={s.cardHead}>Example: {SAMPLE_HOME.label}</p>
            <p className={s.cardSystem}>{recommended.label}</p>
            <p className={`fig ${s.cardSave}`}>{gbpRange(recommended.annualSavingGbp)}</p>
            <p className={s.cardSaveLabel}>estimated saving a year</p>
            <dl className={s.cardFacts}>
              <div><dt>Installed price</dt><dd className="fig">{gbpRange(recommended.installedPriceGbp)}</dd></div>
              <div><dt>Pays back in</dt><dd className="fig">{years(recommended.paybackYears)}</dd></div>
              <div><dt>Generates</dt><dd className="fig">{kwh(recommended.year.generationKwh)} a year</dd></div>
            </dl>
            <p className={s.cardNote}>Worked out with example tariff rates. Yours come from your own home.</p>
          </aside>
        </div>
      </section>


      {/* TRUST STRIP: our actual promises, no borrowed logos */}
      <section className={s.trust} aria-label="Our promises">
        <ul>
          <li><strong>Independent</strong><span>We don’t sell or fit anything</span></li>
          <li><strong>MCS-certified installers only</strong><span>Checked by us, every year</span></li>
          <li><strong>Three installers at most</strong><span>Only the ones you choose</span></li>
          <li><strong>Free for homeowners</strong><span><Link href="/how-we-make-money">How we make money</Link></span></li>
        </ul>
      </section>

      {/* WHAT YOU GET: the whole comparison, including the options we don't recommend */}
      <section className={s.compare}>
        <div className={s.compareIntro}>
          <h2 className={s.h2}>You see every option, not just the one someone wants to sell you.</h2>
          <p className={s.lead}>
            Here is the full result for the example home. We compare solar on its own, solar with different batteries and,
            where your tariff allows it, a battery on its own. Then we tell you which one gives the most back over 20 years.
          </p>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <caption className="sr-only">Options for the example home</caption>
            <thead>
              <tr>
                <th scope="col">System</th>
                <th scope="col">Saving a year</th>
                <th scope="col">Installed price</th>
                <th scope="col">Pays back in</th>
                <th scope="col">Own solar used</th>
              </tr>
            </thead>
            <tbody>
              {assessment.options.map((o) => (
                <tr key={o.id} className={o.id === assessment.recommendedId ? s.rowBest : undefined}>
                  <th scope="row">
                    {o.label}
                    {o.id === assessment.recommendedId && <span className={s.bestTag}>Best value over 20 years</span>}
                  </th>
                  <td className="fig">{gbpRange(o.annualSavingGbp)}</td>
                  <td className="fig">{gbpRange(o.installedPriceGbp)}</td>
                  <td className="fig">{years(o.paybackYears)}</td>
                  <td className="fig">{o.kWp > 0 ? pct(o.year.selfSufficiency) : 'None'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={s.tableNote}>
            Ranges allow for weather and price differences. A battery on its own saves money by charging on a cheap overnight
            rate, so it uses none of your own solar.
          </p>
        </div>
      </section>

      <QuoteExhibit />

      {/* HOW IT WORKS: a real sequence, so it's numbered */}
      <section id="how-it-works" className={s.steps}>
        <h2 className={s.h2}>How it works</h2>
        <ol className={s.stepList}>
          <li>
            <h3>Tell us about your home</h3>
            <p>Your town, roof, what you use and your tariff. It takes about two minutes and needs no phone number.</p>
          </li>
          <li>
            <h3>See your options</h3>
            <p>Every system that suits your roof, with savings, price and payback as honest ranges.</p>
          </li>
          <li>
            <h3>Choose up to three installers</h3>
            <p>Only vetted, MCS-certified firms that cover your area. They quote on one standard form so you can compare like with like.</p>
          </li>
          <li>
            <h3>Pick the quote that suits you</h3>
            <p>They visit, confirm the design and fit it. You review them afterwards so the next household knows who to trust.</p>
          </li>
        </ol>
      </section>

      {/* PROMISE: the privacy line, over open sky */}
      <section className={s.promise}>
        <Image src="/img/dormer-roof-sky-2400.webp" alt="" fill sizes="100vw" className={s.promiseImg} />
        <div className={s.promiseText}>
          <h2 className={s.promiseTitle}>Your number goes to three installers at most, and only the ones you pick.</h2>
          <p>We never sell your details. Nobody calls until you ask them to.</p>
        </div>
      </section>

      {/* INSTALLERS */}
      <section className={s.installers}>
        <div className={s.installersMedia}>
          <Image src="/img/installer-ladder-1600.webp" alt="An installer in a hard hat fitting solar panels" fill sizes="(max-width: 900px) 100vw, 45vw" className={s.cover} />
        </div>
        <div className={s.installersText}>
          <h2 className={s.h2}>Installers: quote for homeowners who are ready.</h2>
          <p className={s.lead}>
            Every homeowner has already had their roof, usage and tariff assessed, and chose you. No shared leads, no cold lists.
            Founding installers join free and pay nothing until we start booking surveys for them.
          </p>
          <Link className="btn btn-primary" href="/for-installers">Join as a founding installer</Link>
        </div>
      </section>

      <section className={s.final}>
        <h2 className={s.finalTitle}>Find out what your roof could do.</h2>
        <Link className="btn btn-primary" href="/assessment">See what your home could save</Link>
      </section>
    </>
  );
}
