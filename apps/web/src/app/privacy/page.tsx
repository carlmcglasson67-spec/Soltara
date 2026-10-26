import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import s from '../legal.module.css';

const UPDATED = '26 October 2026';

export const metadata: Metadata = {
  title: 'Privacy notice',
  description: 'What Soltara Energy collects, why, who sees it, and your rights. Your assessment goes to at most three installers you choose, and your details are never sold.',
};

const SECTIONS = [
  { id: 'who', title: 'Who we are' },
  { id: 'assessment', title: 'The home assessment' },
  { id: 'quotes', title: 'When you ask for quotes' },
  { id: 'installers', title: 'Installer applications' },
  { id: 'sharing', title: 'Who we share data with' },
  { id: 'keeping', title: 'How long we keep it' },
  { id: 'cookies', title: 'Cookies and analytics' },
  { id: 'rights', title: 'Your rights' },
  { id: 'contact', title: 'Contact and complaints' },
];

export default function Privacy() {
  return (
    <article className={s.page}>
      <header className={s.head}>
        <div>
          <p className="kicker">Privacy notice</p>
          <h1 className={s.title}>Your details go to three installers at most, and only the ones you pick.</h1>
        </div>
        <div>
          <p className={s.lead}>This notice explains what {SITE.name} collects, why, who sees it and what you can ask us to do. We have written it in plain English on purpose.</p>
          <p className={s.updated}>Last updated {UPDATED}</p>
        </div>
      </header>

      <div className={s.body}>
        <ul className={s.toc} aria-label="On this page">
          {SECTIONS.map((x) => <li key={x.id}><a href={`#${x.id}`}>{x.title}</a></li>)}
        </ul>

        <div className={s.sections}>
          <section id="who">
            <h2>Who we are</h2>
            <p>{SITE.legalName} runs this website and is the data controller for the personal data described here. The site is built and maintained for us by {SITE.builder.name}, who act as our data processor and only handle data on our instructions.</p>
            <p>If you want to contact us about your data, see the <a href="#contact">contact section</a> below.</p>
          </section>

          <section id="assessment">
            <h2>The home assessment</h2>
            <p>The assessment on this site runs in your browser. The answers you give (postcode, house type, roof details, electricity use and tariff) are used to work out your options and are not saved by us.</p>
            <p>Your postcode is sent to two services to do the sums: <strong>postcodes.io</strong> turns it into a map location, and the European Commission’s <strong>PVGIS</strong> service returns typical solar output for that location. Neither receives your name or any other detail, and a postcode on its own does not identify a person.</p>
            <div className={s.callout}>
              <strong>Nothing is stored unless you ask for quotes.</strong>
              You can run the assessment as many times as you like without giving us an email address or a phone number.
            </div>
          </section>

          <section id="quotes">
            <h2>When you ask for quotes</h2>
            <p>If you choose to request quotes, we collect your name, email address, postcode and a summary of your assessment. We use this to match you with vetted installers who cover your area and to pass your assessment to the ones you choose.</p>
            <p>We rely on your consent for this, which you give by ticking the box on the form. You can withdraw it at any time by contacting us, and we will stop sharing your details from that point.</p>
            <p>We do not ask for a phone number at this stage. An installer only gets your contact details once you have chosen them, and they are told in writing not to contact you before then.</p>
          </section>

          <section id="installers">
            <h2>Installer applications</h2>
            <p>If you apply to join as an installer we collect your company name, your name, email address, phone number, MCS certificate number, the areas you cover and what you install. We use this to check your firm against our verification standards and to arrange a call. The basis for this is our legitimate interest in running a vetted marketplace, and the steps needed before entering an agreement with you.</p>
            <p>We check the details you give against public registers, including the MCS installer database and Companies House.</p>
          </section>

          <section id="sharing">
            <h2>Who we share data with</h2>
            <ul>
              <li><strong>Installers you choose.</strong> At most three per request, and only after you have picked them.</li>
              <li><strong>Web3Forms.</strong> Delivers form submissions to our mailbox. It processes the submission in order to send it and does not use it for anything else.</li>
              <li><strong>Vercel.</strong> Hosts the website and processes requests to it, which includes your IP address in standard server logs.</li>
              <li><strong>postcodes.io and PVGIS.</strong> Receive your postcode only, as described above.</li>
            </ul>
            <p>We never sell personal data, and we never pass it to installers you have not chosen, to marketing lists or to lead brokers.</p>
          </section>

          <section id="keeping">
            <h2>How long we keep it</h2>
            <p>Quote requests are kept for 12 months after your last contact with us so that we can follow up on your installation and your review. Installer applications are kept for the length of our relationship with your firm, or 12 months if the application does not go ahead. You can ask us to delete your data sooner at any time.</p>
          </section>

          <section id="cookies">
            <h2>Cookies and analytics</h2>
            <p>This site does not use advertising cookies and does not run third-party tracking. If we add privacy-respecting analytics later, this section will say so before it happens.</p>
          </section>

          <section id="rights">
            <h2>Your rights</h2>
            <p>Under UK data protection law you can ask us to:</p>
            <ul>
              <li>tell you what personal data we hold about you and give you a copy;</li>
              <li>correct anything that is wrong;</li>
              <li>delete your data;</li>
              <li>stop using your data for a particular purpose, or stop sharing it with installers;</li>
              <li>give you your data in a form you can take elsewhere.</li>
            </ul>
            <p>We will answer within one month. There is no charge.</p>
          </section>

          <section id="contact">
            <h2>Contact and complaints</h2>
            <p>
              {SITE.email
                ? <>Email us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a> for anything to do with your data.</>
                : <>To contact us about your data, use the <Link href="/assessment">quote request form</Link> and say in the message that it is a privacy request. A direct email address will be published here shortly.</>}
            </p>
            <p>If you are not happy with how we have handled your data you can complain to the Information Commissioner’s Office at <a href="https://ico.org.uk" rel="noopener">ico.org.uk</a> or on 0303 123 1113.</p>
          </section>
        </div>
      </div>
    </article>
  );
}
