import type { Metadata } from 'next';
import Link from 'next/link';
import Icon from '../Icon';
import i from '../inner.module.css';
import s from './money.module.css';

export const metadata: Metadata = {
  title: 'How we make money',
  description: 'Soltara is free for homeowners. Installers pay us when we book a survey for them. Payment never changes how quotes are shown.',
  alternates: { canonical: '/how-we-make-money' },
};

const POINTS = [
  { icon: 'pound', title: 'Free for homeowners', body: 'You never pay Soltara anything, whether or not you go ahead. No fees, no subscription, nothing hidden in the installer’s price.' },
  { icon: 'form', title: 'Installers pay per booked survey', body: 'An installer pays us when we book a site survey for them. Founding installers pay nothing until we are booking surveys for them.' },
  { icon: 'scales', title: 'Payment never buys a better position', body: 'Quotes are shown on the same standard form. No installer can pay to be recommended, promoted or shown first.' },
  { icon: 'lock', title: 'Your details are never sold', body: 'Your assessment goes to at most three installers, and only the ones you choose. Nobody calls until you ask them to.' },
];

const NEVER = [
  'Sell your details to anyone',
  'Take any commission on the system you buy',
  'Let an installer pay for a higher ranking',
  'Show a “guaranteed saving”: every figure is a range with its assumptions',
  'Arrange finance or promise grant eligibility',
];

const Cross = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
);

export default function HowWeMakeMoney() {
  return (
    <>
      <section className={`${i.hero} ${i.heroGlow} grain`} data-surface="dark">
        <div className={`${i.heroGrid} ${i.heroCompact}`}>
          <div>
            <p className="kicker kicker-light" data-rise>How we make money</p>
            <h1 className={i.heroTitle} data-rise style={{ ['--i' as string]: 1 }}>Free for you. Installers pay <em>when we book them real work.</em></h1>
            <p className={i.heroLead} data-rise style={{ ['--i' as string]: 2 }}>
              Comparison sites usually make money in ways they don’t explain. Here is exactly how Soltara does, so you can judge
              our recommendations for yourself.
            </p>
          </div>
          <dl className={`${i.readouts} ${i.heroAside}`} data-rise style={{ ['--i' as string]: 3 }}>
            <div><dt>Cost to homeowners</dt><dd>£0</dd></div>
            <div><dt>Installers who see your details</dt><dd>≤3</dd></div>
            <div><dt>Paid placement</dt><dd>None</dd></div>
          </dl>
        </div>
      </section>

      <section className={i.section}>
        <header className={i.head}>
          <div>
            <p className="kicker" data-reveal>Follow the money</p>
            <h2 className={i.h2} data-reveal style={{ ['--i' as string]: 1 }}>One payment, <em>in one direction.</em></h2>
          </div>
          <p className={i.lead} data-reveal style={{ ['--i' as string]: 2 }}>
            Money moves once: from an installer to us, after we book a survey they agreed to. Nothing flows from you, and nothing
            buys a place in the results.
          </p>
        </header>
        <ol className={s.flow} data-reveal aria-label="How money moves">
          <li><span className={s.node}>You</span><p className={s.nodeNote}>Check your home, compare options, choose up to three installers.</p><p className={`fig ${s.pay}`}>You pay £0</p></li>
          <li><span className={`${s.node} ${s.nodeMid}`}>Soltara</span><p className={s.nodeNote}>Books a survey with an installer you chose.</p><p className={`fig ${s.pay}`}>No commission on your system</p></li>
          <li><span className={s.node}>Installer</span><p className={s.nodeNote}>Surveys, confirms the design and quotes on the standard form.</p><p className={`fig ${s.pay} ${s.payOut}`}>Pays per booked survey</p></li>
        </ol>
      </section>

      <section className={`${i.section} ${i.paper2}`}>
        <header className={i.head}>
          <div>
            <p className="kicker" data-reveal>The rules we work to</p>
            <h2 className={i.h2} data-reveal style={{ ['--i' as string]: 1 }}>Four rules, applied to every quote.</h2>
          </div>
        </header>
        <ul className={i.cols}>
          {POINTS.map((p, n) => (
            <li key={p.title} data-reveal style={{ ['--i' as string]: n }}>
              <span className={i.num}>0{n + 1}</span>
              <span className={i.colIcon}><Icon name={p.icon} size={30} /></span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${i.section} ${i.dark} grain`} data-surface="dark">
        <div className={i.split}>
          <div className={i.sticky}>
            <p className="kicker kicker-light" data-reveal>In writing</p>
            <h2 className={i.h2} data-reveal style={{ ['--i' as string]: 1 }}>What we will <em>never</em> do.</h2>
            <p className={i.lead} data-reveal style={{ ['--i' as string]: 2 }}>If any of these ever changes, this page changes first.</p>
          </div>
          <ol className={i.rows}>
            {NEVER.map((n, k) => (
              <li key={n} data-reveal style={{ ['--i' as string]: k }}>
                <span className={s.x}><Cross /></span>
                <div><strong>{n}</strong></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${i.close} band-blue grain`}>
        <div>
          <p className="kicker kicker-blue" data-reveal>Your turn</p>
          <h2 className={i.closeTitle} data-reveal style={{ ['--i' as string]: 1 }}>See what <em>your home</em> could save.</h2>
        </div>
        <div className={i.closeAction} data-reveal style={{ ['--i' as string]: 2 }}>
          <Link className="btn btn-sun btn-lg btn-arrow" href="/assessment">Check my home</Link>
        </div>
      </section>
    </>
  );
}
