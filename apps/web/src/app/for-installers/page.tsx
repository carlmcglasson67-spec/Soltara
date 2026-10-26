import type { Metadata } from 'next';
import Image from 'next/image';
import Icon from '../Icon';
import InstallerApply from './InstallerApply';
import s from './installers.module.css';

export const metadata: Metadata = {
  title: 'For installers',
  description:
    'Quote for homeowners who have already had their roof, usage and tariff assessed, and who chose you. Founding installers join free.',
};

const POINTS = [
  { icon: 'home', title: 'Assessed homeowners', body: 'You see the home before you visit: roof direction and pitch, shading, annual usage, tariff, EV plans, and the system our assessment recommended.' },
  { icon: 'three', title: 'Three installers at most', body: 'A homeowner shares their assessment with no more than three firms, and only ones they chose. You are never one of ten.' },
  { icon: 'form', title: 'One standard quote form', body: 'Quote line by line on the same form as everyone else, so a better system is seen as better, not just more expensive.' },
  { icon: 'chart', title: 'Numbers you can check', body: 'We publish how many assessments turn into surveys and installs. You can work out your cost per job won before you spend anything.' },
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
      <section className={s.hero}>
        <div className={s.heroText}>
          <p className="kicker">For installers</p>
          <h1 className={s.title}>Quote for homeowners who are ready.</h1>
          <p className={s.lead}>
            Every homeowner who reaches you has already had their roof, usage and tariff assessed, has seen honest numbers,
            and picked you. No shared leads, no cold lists, no chasing people who only clicked an advert.
          </p>
          <div className={s.heroActions}>
            <a className="btn btn-primary btn-arrow" href="#apply">Apply to join</a>
            <a className="btn btn-quiet" href="#terms">Founding terms</a>
          </div>
        </div>
        <div className={s.heroMedia}>
          <Image src="/img/installer-ladder-1600.webp" alt="An installer fitting solar panels" fill priority sizes="(max-width: 900px) 100vw, 50vw" className={s.cover} />
        </div>
        <dl className={s.stats} aria-label="Founding installer headline terms">
          <div><dt>To join</dt><dd className="fig">£0</dd></div>
          <div><dt>Installers per job</dt><dd className="fig">3 max</dd></div>
          <div><dt>Lead charges at launch</dt><dd className="fig">None</dd></div>
          <div><dt>Contract term</dt><dd className="fig">None</dd></div>
        </dl>
      </section>

      <section className={s.split}>
        <div>
          <p className="kicker">What you get</p>
          <h2 className={s.h2}>Serious customers, no shared leads.</h2>
        </div>
        <ul className={s.points}>
          {POINTS.map((p, i) => (
            <li key={p.title}>
              <span className={s.pointNum}>0{i + 1}</span>
              <Icon name={p.icon} size={30} />
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="terms" className={`${s.terms} glow`}>
        <div>
          <p className="kicker kicker-light">Founding installer terms</p>
          <h2 className={s.h2}>Free to join. Pay only when it works.</h2>
          <p className={s.lead}>We’re signing founding installers region by region, and each region opens to homeowners once it has enough vetted firms to give them a real choice.</p>
        </div>
        <ul className={s.termList}>
          <li><strong>Free to join.</strong> No sign-up fee and no monthly membership.</li>
          <li><strong>No lead charges at launch.</strong> You pay nothing until we are booking surveys for you.</li>
          <li><strong>Then, pay per booked survey.</strong> We agree the price with founding installers before we charge anything, and it is fixed in writing.</li>
          <li><strong>Leave whenever you like.</strong> No contract term.</li>
        </ul>
      </section>

      <section id="verified" className={s.verified}>
        <div className={s.verifiedHead}>
          <div>
            <p className="kicker">Soltara Verified</p>
            <h2 className={s.h2}>What we check before a homeowner can choose you.</h2>
            <p className={s.lead}>Every check again, every year. The badge appears beside your name on every quote.</p>
          </div>
          <div className={s.badge} aria-hidden="true">
            <Icon name="badge" size={44} />
            <span className={s.badgeWord}>Soltara<br />Verified</span>
          </div>
        </div>
        <ul className={s.checks}>
          {CHECKS.map((c) => (
            <li key={c}><Icon name="check" size={22} />{c}</li>
          ))}
        </ul>
      </section>

      <section id="apply" className={s.apply}>
        <div>
          <p className="kicker">Apply to join</p>
          <h2 className={s.h2}>Tell us about your firm.</h2>
          <p className={s.lead}>We reply within two working days and arrange a short call. Founding places in each region are limited so that every installer gets a real share of the work.</p>
        </div>
        <div className={s.formPanel}>
          <InstallerApply />
        </div>
      </section>
    </>
  );
}
