import type { Metadata } from 'next';
import Link from 'next/link';
import { monthlyRepayment } from '@soltara/engine';
import { gbp } from '@/lib/format';
import s from './loans.module.css';

const UPDATED = '23 October 2026';

export const metadata: Metadata = {
  title: 'Warm Homes Loan Scheme: what we know',
  description:
    'The Warm Homes Loan Scheme offers lower-interest loans for solar panels, batteries and heat pumps. What is confirmed, what isn’t yet, and how to be ready. Updated ' +
    UPDATED + '.',
};

const faq = [
  {
    q: 'What is the Warm Homes Loan Scheme?',
    a: 'A government scheme that pays approved, FCA-regulated lenders to lower the interest rate on loans for home energy upgrades. The government doesn’t lend the money itself; you borrow from a lender taking part.',
  },
  {
    q: 'Can I apply now?',
    a: `Not yet, as far as we can find (${UPDATED}). The first round of lenders was chosen over the summer, but no lender had announced a loan product by early October. Expect the first products between late 2026 and early 2027.`,
  },
  {
    q: 'What can it pay for?',
    a: 'Solar panels, home batteries (on their own or with solar), heat pumps and some other renewables. EV chargers only count alongside solar or a battery. Insulation, windows and doors are not included.',
  },
  {
    q: 'How much can I borrow?',
    a: 'The published caps are up to £20,000 for solar and other micro-renewables, £15,000 for a battery, £20,000 for an air-to-water heat pump and £35,000 for a ground source heat pump. The lender decides what it will actually lend you.',
  },
  {
    q: 'How cheap will the loans be?',
    a: 'The subsidy can bring a lender’s rate down by up to about 5 percentage points. The final rate depends on the lender, the loan term and your circumstances, so nobody can tell you your rate until lenders publish their products.',
  },
  {
    q: 'Does it matter which installer I use?',
    a: 'Yes. The work must be done by an installer that is MCS-certified for that technology, and lenders check this before and after the installation. Every installer on Soltara is MCS-certified.',
  },
  {
    q: 'What will a lender need from my quote?',
    a: 'Based on the scheme rules: dated within the last six months, addressed to you, on the company’s headed paper, with the installer’s MCS number, your full address, itemised costs and the system size in kW. Quotes through Soltara include all of these.',
  },
];

export default function WarmHomesLoans() {
  const normal = gbp(monthlyRepayment(10000, 9.9, 15));
  const cheap = gbp(monthlyRepayment(10000, 4.9, 15));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <article className={s.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className={s.head}>
        <div>
          <p className="kicker">Guide</p>
          <h1 className={s.title}>Warm Homes Loan Scheme: what we know so far.</h1>
        </div>
        <div className={s.headSide}>
          <p className={s.lead}>
            Lower-interest loans for solar, batteries and heat pumps are on the way, but they are not open to homeowners yet.
            Here is what is confirmed and what isn’t.
          </p>
          <p className={s.updated}>Last checked {UPDATED}</p>
        </div>
      </header>

      <section className={s.timeline} aria-label="Timeline">
        <ol>
          <li><p className={s.when}>24 June 2026</p><p>Government opens applications for lenders to join.</p></li>
          <li><p className={s.when}>29 July 2026</p><p>First round of lender applications closes.</p></li>
          <li><p className={s.when}>September 2026</p><p>Scheme rules pointed to loans for homeowners from this month. None had been announced by early October.</p></li>
          <li className={s.next}><p className={s.when}>Late 2026 to early 2027</p><p>First loan products expected, each launched by its own lender. A second round of lenders joins in early 2027.</p></li>
        </ol>
      </section>

      <section className={s.example}>
        <p className="kicker">Why it matters</p>
        <h2 className={s.h2}>Cheaper borrowing can bring the repayment close to the saving.</h2>
        <p>
          Cheaper borrowing can make the monthly repayment on panels and a battery close to the monthly saving. For example, on a
          £10,000 system over 15 years, a loan at 9.9% costs about {normal} a month; at 4.9% it is about {cheap}. These rates are
          illustrative only, not offers.
        </p>
        <p>
          <Link href="/assessment">Check what your home could save</Link> to see how your own saving compares.
        </p>
      </section>

      <section className={s.faq}>
        <div>
          <p className="kicker">FAQ</p>
          <h2 className={s.h2}>Questions people ask</h2>
        </div>
        <dl>
          {faq.map((f) => (
            <div key={f.q}><dt>{f.q}</dt><dd>{f.a}</dd></div>
          ))}
        </dl>
      </section>

      <footer className={s.foot}>
        <p>
          <strong>Soltara doesn’t lend money or arrange loans.</strong> We explain the scheme and make sure installer quotes have
          what lenders ask for. When lenders launch, apply to them directly. This page is general information, not financial advice.
        </p>
        <p className={s.sources}>
          Sources: <a href="https://www.gov.uk/government/publications/warm-homes-loan-scheme-apply-to-participate-as-a-lender-phase-1">GOV.UK: Warm Homes Loan Scheme lender applications</a>
          {' · '}<a href="https://www.backedbyample.com/installers/news/warm-homes-loan-scheme-for-installers">Ample: what installers need to know</a>
          {' · '}<a href="https://www.signix.co.uk/news/warm-homes-loan-scheme-2026">Signix: Warm Homes Loan Scheme 2026</a>
        </p>
      </footer>
    </article>
  );
}
