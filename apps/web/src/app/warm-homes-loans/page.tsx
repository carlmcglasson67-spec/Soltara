import type { Metadata } from 'next';
import Link from 'next/link';
import { monthlyRepayment } from '@soltara/engine';
import { gbp } from '@/lib/format';
import i from '../inner.module.css';
import s from './loans.module.css';

const UPDATED = '9 November 2026';

export const metadata: Metadata = {
  title: 'Warm Homes Loan Scheme: what we know',
  description:
    'The Warm Homes Loan Scheme is open: lower-interest loans for solar panels, batteries and heat pumps from ten approved lenders. How it works, what it covers and what a lender needs from your quote. Updated ' +
    UPDATED + '.',
  alternates: { canonical: '/warm-homes-loans' },
};

const LENDERS = ['Homeserve (with E.ON)', 'Hometree Finance', 'Propensio', 'Secure Trust Bank', 'Selina Finance', 'South Manchester Credit Union', 'Sunsave', 'Tandem Bank', 'The Money Co-op', 'thisbank'];

const CAPS: [string, number][] = [
  ['Solar panels', 15000], ['Home battery', 15000], ['Air-to-water heat pump', 20000], ['Ground source heat pump', 35000],
  ['Air-to-air heat pump', 10000], ['Other micro-renewables', 20000],
];

const TIMELINE = [
  { when: '24 June 2026', what: 'Government opens applications for lenders to join.' },
  { when: 'July 2026', what: 'First round of lender applications closes.' },
  { when: '27 October 2026', what: 'Scheme opens to households across the UK, with ten lenders taking part.', now: true },
  { when: 'Late 2026 to early 2027', what: 'A second round of lenders is expected to apply, joining in early 2027.' },
];

const faq = [
  {
    q: 'What is the Warm Homes Loan Scheme?',
    a: 'A government scheme that pays approved lenders to lower the interest rate on loans for home energy upgrades, by up to about 5 percentage points. The government doesn’t lend the money itself; you borrow from a lender taking part.',
  },
  {
    q: 'Can I apply now?',
    a: 'Yes. The scheme opened to households across the UK on 27 October 2026. You apply to a participating lender, either directly or, where the lender allows it, through your installer. The lender runs its usual affordability and credit checks.',
  },
  {
    q: 'What can it pay for, and how much can I borrow?',
    a: 'Solar panels and home batteries up to £15,000 each, air-to-water heat pumps up to £20,000, ground source heat pumps up to £35,000, and other micro-renewables up to £20,000. Each lender sets its own rules within those limits and decides what it will actually lend you.',
  },
  {
    q: 'How cheap are the loans?',
    a: 'The scheme can bring a lender’s rate down by up to about 5 percentage points, and some lenders offer interest-free loans. Your rate depends on the lender, the loan term and your circumstances, so compare lenders before you apply.',
  },
  {
    q: 'Does it matter which installer I use?',
    a: 'Yes. Except for heat network connections, the work must be done by an installer that is MCS-certified for that technology. Some lenders work only with their own installers; others accept any MCS-certified firm. Every installer on Soltara is MCS-certified.',
  },
  {
    q: 'What will a lender need from my quote?',
    a: 'Expect to show a quote dated within the last six months, addressed to you, with the installer’s MCS number, your full address, itemised costs and the system size in kW, then keep the invoice and MCS certificate after the work. Quotes through Soltara include all of these.',
  },
];

export default function WarmHomesLoans() {
  const normal = gbp(monthlyRepayment(10000, 9.9, 15));
  const cheap = gbp(monthlyRepayment(10000, 4.9, 15));
  const maxCap = Math.max(...CAPS.map(([, v]) => v));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <section className={`${i.hero} ${i.heroGlow} grain`} data-surface="dark">
        <div className={i.heroGrid}>
          <div>
            <p className="kicker kicker-light" data-rise>Guide · Last checked {UPDATED}</p>
            <h1 className={i.heroTitle} data-rise style={{ ['--i' as string]: 1 }}>The Warm Homes Loan Scheme <em>is open.</em></h1>
            <p className={i.heroLead} data-rise style={{ ['--i' as string]: 2 }}>
              Lower-interest loans for solar panels, batteries and heat pumps, from lenders approved by the government. Here is how
              it works, what it covers and what a lender will want to see.
            </p>
          </div>
          <dl className={`${i.readouts} ${i.heroAside}`} data-rise style={{ ['--i' as string]: 3 }}>
            <div><dt>Opened to households</dt><dd>27 Oct</dd></div>
            <div><dt>Lenders at launch</dt><dd>10</dd></div>
            <div><dt>Interest rate cut</dt><dd>up to 5pp</dd></div>
          </dl>
        </div>
      </section>

      <section className={i.section}>
        <header className={i.head}>
          <div>
            <p className="kicker" data-reveal>Timeline</p>
            <h2 className={i.h2} data-reveal style={{ ['--i' as string]: 1 }}>From announcement <em>to open.</em></h2>
          </div>
          <p className={i.lead} data-reveal style={{ ['--i' as string]: 2 }}>More lenders are expected to join in early 2027, so the choice of loans should widen over the next few months.</p>
        </header>
        <ol className={s.timeline} data-reveal>
          {TIMELINE.map((t, n) => (
            <li key={t.when} className={t.now ? s.now : undefined} style={{ ['--i' as string]: n }}>
              <p className={`fig ${s.when}`}>{t.when}</p>
              <p>{t.what}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${i.section} ${i.paper2}`}>
        <div className={i.split}>
          <div className={i.sticky}>
            <p className="kicker" data-reveal>What it covers</p>
            <h2 className={i.h2} data-reveal style={{ ['--i' as string]: 1 }}>The most you can borrow, by technology.</h2>
            <p className={`${i.lead} ${s.gap}`} data-reveal style={{ ['--i' as string]: 2 }}>Published limits. Each lender decides what it will actually lend you.</p>
          </div>
          <ul className={s.caps} data-reveal>
            {CAPS.map(([label, v]) => (
              <li key={label}>
                <span>{label}</span>
                <span className={s.capBar}><i style={{ ['--w' as string]: `${(v / maxCap) * 100}%` }} /></span>
                <b className="fig">up to {gbp(v)}</b>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${i.section} ${i.ink} grain`} data-surface="dark">
        <div className={i.split}>
          <div>
            <p className="kicker kicker-blue" data-reveal>Why it matters</p>
            <h2 className={i.h2} data-reveal style={{ ['--i' as string]: 1 }}>Cheaper borrowing can bring the repayment <em>close to the saving.</em></h2>
          </div>
          <div className={s.example} data-reveal style={{ ['--i' as string]: 2 }}>
            <p className={s.exampleIntro}>£10,000 borrowed over 15 years</p>
            <dl className={s.compare}>
              <div><dt>At 9.9%</dt><dd>{normal}<span>a month</span></dd></div>
              <div><dt>At 4.9%</dt><dd>{cheap}<span>a month</span></dd></div>
            </dl>
            <p className={s.exampleNote}>Illustrative rates only, not offers. <Link href="/assessment">Check what your home could save</Link> to compare with your own monthly saving.</p>
          </div>
        </div>
      </section>

      <section className={i.section}>
        <div className={i.split}>
          <div className={i.sticky}>
            <p className="kicker" data-reveal>Lenders at launch</p>
            <h2 className={i.h2} data-reveal style={{ ['--i' as string]: 1 }}>Ten lenders, listed by the government.</h2>
            <p className={`${i.lead} ${s.gap}`} data-reveal style={{ ['--i' as string]: 2 }}>We don’t recommend a lender or earn anything from one. Compare their rates and terms yourself.</p>
          </div>
          <ul className={s.lenders} data-reveal>
            {LENDERS.map((l) => <li key={l}>{l}</li>)}
          </ul>
        </div>
      </section>

      <section className={`${i.section} ${i.paper2}`}>
        <div className={i.split}>
          <div className={i.sticky}>
            <p className="kicker" data-reveal>Questions</p>
            <h2 className={i.h2} data-reveal style={{ ['--i' as string]: 1 }}>What people ask.</h2>
          </div>
          <div className={s.faq}>
            {faq.map((f, n) => (
              <details key={f.q} className={s.faqItem} data-reveal style={{ ['--i' as string]: n }}>
                <summary>{f.q}<span aria-hidden="true" /></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={`${i.section} ${s.foot}`}>
        <p className={s.disclaimer}>
          <strong>Soltara doesn’t lend money, arrange loans or give financial advice.</strong> We explain the scheme and make sure
          installer quotes have what lenders ask for. Apply to lenders directly. This page is general information, last checked {UPDATED}.
        </p>
        <p className={s.sources}>
          Sources: <a href="https://www.gov.uk/government/news/warm-homes-loan-scheme-factsheet">GOV.UK: Warm Homes Loan Scheme factsheet</a>
          {' · '}<a href="https://www.gov.uk/government/publications/warm-homes-loan-scheme-apply-to-participate-as-a-lender-phase-1">GOV.UK: lender applications and scheme rules</a>
          {' · '}<a href="https://energysavingtrust.org.uk/advice/warm-homes-loan-scheme/">Energy Saving Trust: Warm Homes Loan Scheme</a>
        </p>
      </section>
    </>
  );
}
