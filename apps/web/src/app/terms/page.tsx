import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import s from '../legal.module.css';

const UPDATED = '26 October 2026';

export const metadata: Metadata = {
  title: 'Terms of use',
  description: 'The terms for using the Soltara Energy website and assessment. Every figure is an estimate shown as a range; a site survey confirms the design and price.',
};

const SECTIONS = [
  { id: 'service', title: 'What Soltara is' },
  { id: 'estimates', title: 'Estimates, not promises' },
  { id: 'installers', title: 'Installers and your contract' },
  { id: 'finance', title: 'Finance and grants' },
  { id: 'use', title: 'Using the site' },
  { id: 'liability', title: 'Our responsibility' },
  { id: 'changes', title: 'Changes and law' },
];

export default function Terms() {
  return (
    <article className={s.page}>
      <header className={s.head}>
        <div>
          <p className="kicker">Terms of use</p>
          <h1 className={s.title}>Plain terms for a plain service.</h1>
        </div>
        <div>
          <p className={s.lead}>These terms apply when you use the {SITE.name} website, the home assessment, and the quote request service. Using the site means you accept them.</p>
          <p className={s.updated}>Last updated {UPDATED}</p>
        </div>
      </header>

      <div className={s.body}>
        <ul className={s.toc} aria-label="On this page">
          {SECTIONS.map((x) => <li key={x.id}><a href={`#${x.id}`}>{x.title}</a></li>)}
        </ul>

        <div className={s.sections}>
          <section id="service">
            <h2>What Soltara is</h2>
            <p>{SITE.legalName} runs a home energy marketplace. We provide an independent assessment of solar and battery options for your home, and we introduce you to vetted installers who quote for the work. We do not sell, design, supply or install anything ourselves.</p>
            <p>The service is free for homeowners. Installers pay us when we book a survey for them. How that works is set out in full on <Link href="/how-we-make-money">How we make money</Link>, and payment never changes which options we show you or the order they appear in.</p>
          </section>

          <section id="estimates">
            <h2>Estimates, not promises</h2>
            <div className={s.callout}>
              <strong>Every saving, price and payback figure on this site is an estimate shown as a range.</strong>
              It is worked out from the details you enter, typical solar data for your postcode, example tariff rates and a price book of typical installed costs, all of which are listed with each result.
            </div>
            <p>Real results depend on your roof, your usage, the weather, energy prices and the system an installer actually fits. We do not guarantee any saving, generation figure or payback period. A site survey by an MCS-certified installer confirms the design and the price before you commit to anything.</p>
          </section>

          <section id="installers">
            <h2>Installers and your contract</h2>
            <p>Installers on Soltara are independent businesses. We check them against our published standards (see <Link href="/for-installers#verified">Soltara Verified</Link>) before they can quote, and again every year, but we are not a party to any contract you make with them.</p>
            <p>Any quote, survey, installation, warranty or after-sales service is between you and the installer. Your statutory rights as a consumer apply to that contract in the usual way, and the installer’s membership of RECC or HIES gives you access to their complaints and dispute schemes.</p>
            <p>If an installer behaves badly towards you, tell us. We investigate every report and remove installers who do not meet our standards.</p>
          </section>

          <section id="finance">
            <h2>Finance and grants</h2>
            <p>Soltara does not lend money, arrange loans or give financial advice, and is not authorised by the Financial Conduct Authority. Where we describe a scheme such as the Warm Homes Loan Scheme, it is general information only. Whether you qualify for any loan or grant is decided by the lender or scheme operator, not by us.</p>
          </section>

          <section id="use">
            <h2>Using the site</h2>
            <p>You agree to give accurate details, to use the assessment for your own home or one you are responsible for, and not to submit quote requests or installer applications you do not intend to follow through. You must not copy the site, scrape it, or use it to build a competing service.</p>
            <p>The site, its design, its text and the assessment method belong to {SITE.legalName}. Photography is licensed from Adobe Stock and may not be reused.</p>
          </section>

          <section id="liability">
            <h2>Our responsibility</h2>
            <p>We take care to keep the site accurate and working, but we provide it as it is and cannot promise it will always be available or free of errors. We are not responsible for decisions you make based on an estimate, for the work of any installer, or for losses that we could not reasonably have foreseen. Nothing in these terms limits any liability that the law does not allow us to limit.</p>
          </section>

          <section id="changes">
            <h2>Changes and law</h2>
            <p>We may update these terms. The date at the top shows the current version, and changes apply from the time they are published. These terms are governed by the law of England and Wales, and the courts of England and Wales have jurisdiction over any dispute.</p>
            <p>Questions about these terms: see the contact details in our <Link href="/privacy#contact">privacy notice</Link>.</p>
          </section>
        </div>
      </div>
    </article>
  );
}
