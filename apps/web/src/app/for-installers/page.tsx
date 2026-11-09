import type { Metadata } from 'next';
import Image from 'next/image';
import Icon from '../Icon';
import InstallerApply from './InstallerApply';
import Seal from '../Seal';
import i from '../inner.module.css';
import s from './installers.module.css';

export const metadata: Metadata = {
  title: 'For installers',
  description:
    'Quote for homeowners who have already had their roof, usage and tariff assessed, and who chose you. Founding installers join free.',
  alternates: { canonical: '/for-installers' },
};

const TERMS = [
  { title: 'Free to join.', body: 'No sign-up fee and no monthly membership.' },
  { title: 'No lead charges at launch.', body: 'You pay nothing until we are booking surveys for you.' },
  { title: 'Then, pay per booked survey.', body: 'We agree the price with founding installers before we charge anything, and it is fixed in writing.' },
  { title: 'Leave whenever you like.', body: 'No contract term.' },
];

const POINTS = [
  { icon: 'home', title: 'Assessed homeowners', body: 'You see the home before you visit: roof direction and pitch, shading, annual usage, tariff, EV plans, and the system our assessment recommended.' },
  { icon: 'three', title: 'Three installers at most', body: 'A homeowner shares their assessment with no more than three firms, and only ones they chose. You are never one of ten.' },
  { icon: 'form', title: 'One standard quote form', body: 'Quote line by line on the same form as everyone else, so a better system is seen as better, not just more expensive.' },
  { icon: 'chart', title: 'Numbers you can check', body: 'From launch we will publish how many assessments turn into surveys and installs, so you can work out your cost per job won before you spend anything.' },
];

const CHECKS = [
  'MCS certification for each technology you install',
  'Membership of RECC or HIES',
  'Company identity at Companies House',
  'Public liability insurance',
  'Trading history in the area you cover',
  'Written workmanship and product warranties',
  'A complaints procedure customers can use',
  'Verified reviews from homeowners after each installation',
];

export default function ForInstallers() {
  return (
    <>
      <section className={`${i.hero} grain`} data-surface="dark">
        <div className={i.heroMedia}>
          <Image src="/img/installer-ladder-1600.webp" alt="" fill priority sizes="(max-width: 1100px) 100vw, 46vw" className={i.cover} />
        </div>
        <div className={i.heroGrid}>
          <div>
            <p className="kicker kicker-light" data-rise>For installers</p>
            <h1 className={i.heroTitle} data-rise style={{ ['--i' as string]: 1 }}>Quote for homeowners <em>who are ready.</em></h1>
            <p className={i.heroLead} data-rise style={{ ['--i' as string]: 2 }}>
              Every homeowner who reaches you has already had their roof, usage and tariff assessed, has seen honest numbers,
              and picked you. No shared leads, no cold lists, no chasing people who only clicked an advert.
            </p>
            <div className={i.heroActions} data-rise style={{ ['--i' as string]: 3 }}>
              <a className="btn btn-sun btn-arrow" href="#apply">Apply to join</a>
              <a className="btn btn-ghost" href="#terms">Founding terms</a>
            </div>
          </div>
        </div>
        <h2 className="sr-only">Founding installer terms at a glance</h2>
        <dl className={i.ledger}>
          <div data-reveal><dt>To join</dt><dd>£0</dd></div>
          <div data-reveal style={{ ['--i' as string]: 1 }}><dt>Installers per job</dt><dd>3 <em>max</em></dd></div>
          <div data-reveal style={{ ['--i' as string]: 2 }}><dt>Lead charges at launch</dt><dd>None</dd></div>
          <div data-reveal style={{ ['--i' as string]: 3 }}><dt>Contract term</dt><dd>None</dd></div>
        </dl>
      </section>

      <section className={i.section}>
        <header className={i.head}>
          <div>
            <p className="kicker" data-reveal>What you get</p>
            <h2 className={i.h2} data-reveal style={{ ['--i' as string]: 1 }}>Serious customers, <em>no shared leads.</em></h2>
          </div>
          <p className={i.lead} data-reveal style={{ ['--i' as string]: 2 }}>
            You meet homeowners after the hard part is done: they know what suits their roof and roughly what it costs.
          </p>
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

      <section id="terms" className={`${i.section} ${i.ink} grain`} data-surface="dark">
        <div className={i.split}>
          <div className={i.sticky}>
            <p className="kicker kicker-blue" data-reveal>Founding installer terms</p>
            <h2 className={i.h2} data-reveal style={{ ['--i' as string]: 1 }}>Free to join. Pay only <em>when it works.</em></h2>
            <p className={i.lead} data-reveal style={{ ['--i' as string]: 2 }}>
              We’re signing founding installers region by region, and each region opens to homeowners once it has enough vetted
              firms to give them a real choice.
            </p>
          </div>
          <ol className={i.rows}>
            {TERMS.map((t, n) => (
              <li key={t.title} data-reveal style={{ ['--i' as string]: n }}>
                <span>0{n + 1}</span>
                <div><strong>{t.title}</strong><p>{t.body}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="verified" className={`${i.section} ${i.paper2}`}>
        <header className={`${i.head} ${s.verifiedHead}`}>
          <div>
            <p className="kicker" data-reveal>Soltara Verified</p>
            <h2 className={i.h2} data-reveal style={{ ['--i' as string]: 1 }}>What we check before a homeowner can choose you.</h2>
            <p className={`${i.lead} ${s.verifiedLead}`} data-reveal style={{ ['--i' as string]: 2 }}>Every check again, every year. The badge appears beside your name on every quote.</p>
          </div>
          <div className={s.sealWrap} data-reveal style={{ ['--i' as string]: 2 }}><Seal /></div>
        </header>
        <ul className={i.ticks}>
          {CHECKS.map((c, n) => (
            <li key={c} data-reveal style={{ ['--i' as string]: n % 2 }}><Icon name="check" size={22} />{c}</li>
          ))}
        </ul>
      </section>

      <section id="apply" className={`${i.section} ${i.dark} grain`} data-surface="dark">
        <div className={i.split}>
          <div className={i.sticky}>
            <p className="kicker kicker-light" data-reveal>Apply to join</p>
            <h2 className={i.h2} data-reveal style={{ ['--i' as string]: 1 }}>Tell us about <em>your firm.</em></h2>
            <p className={i.lead} data-reveal style={{ ['--i' as string]: 2 }}>
              We reply within two working days and arrange a short call. Founding places in each region are limited so that every
              installer gets a real share of the work.
            </p>
          </div>
          <div className={i.formCard} data-reveal>
            <InstallerApply />
          </div>
        </div>
      </section>
    </>
  );
}
