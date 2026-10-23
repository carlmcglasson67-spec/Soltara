import type { Metadata } from 'next';
import Image from 'next/image';
import InstallerApply from './InstallerApply';
import s from './installers.module.css';

export const metadata: Metadata = {
  title: 'For installers',
  description:
    'Quote for homeowners who have already had their roof, usage and tariff assessed, and who chose you. Founding installers join free.',
};

export default function ForInstallers() {
  return (
    <>
      <section className={s.hero}>
        <div className={s.heroText}>
          <h1 className={s.title}>Quote for homeowners who are ready.</h1>
          <p className={s.lead}>
            Every homeowner who reaches you has already had their roof, usage and tariff assessed, has seen honest numbers,
            and picked you. No shared leads, no cold lists, no chasing people who only clicked an advert.
          </p>
          <a className="btn btn-primary" href="#apply">Apply to join</a>
        </div>
        <div className={s.heroMedia}>
          <Image src="/img/installer-ladder-1600.webp" alt="An installer fitting solar panels" fill priority sizes="(max-width: 900px) 100vw, 50vw" className={s.cover} />
        </div>
      </section>

      <section className={s.split}>
        <h2 className={s.h2}>What you get</h2>
        <dl className={s.points}>
          <div><dt>Assessed homeowners</dt><dd>You see the home before you visit: roof direction and pitch, shading, annual usage, tariff, EV plans, and the system our assessment recommended.</dd></div>
          <div><dt>Three installers at most</dt><dd>A homeowner shares their assessment with no more than three firms, and only ones they chose. You are never one of ten.</dd></div>
          <div><dt>One standard quote form</dt><dd>Quote line by line on the same form as everyone else, so a better system is seen as better, not just more expensive.</dd></div>
          <div><dt>Numbers you can check</dt><dd>We publish how many assessments turn into surveys and installs. You can work out your cost per job won before you spend anything.</dd></div>
        </dl>
      </section>

      <section className={s.terms}>
        <div>
          <h2 className={s.h2}>Founding installer terms</h2>
          <p className={s.lead}>We are signing a small group of installers across Cumbria and the North West before we launch to homeowners.</p>
        </div>
        <ul className={s.termList}>
          <li><strong>Free to join.</strong> No sign-up fee and no monthly membership.</li>
          <li><strong>No lead charges at launch.</strong> You pay nothing until we are booking surveys for you.</li>
          <li><strong>Then, pay per booked survey.</strong> We agree the price with founding installers before we charge anything, and it is fixed in writing.</li>
          <li><strong>Leave whenever you like.</strong> No contract term.</li>
        </ul>
      </section>

      <section id="verified" className={s.verified}>
        <h2 className={s.h2}>Soltata Verified</h2>
        <p className={s.lead}>What we check before a homeowner can choose you, and again every year.</p>
        <ul className={s.checks}>
          <li>MCS certification for each technology you install</li>
          <li>Membership of RECC or HIES</li>
          <li>Company identity at Companies House</li>
          <li>Public liability insurance</li>
          <li>Trading history in the area you cover</li>
          <li>Written workmanship and product warranties</li>
          <li>A complaints procedure customers can use</li>
          <li>Verified reviews from homeowners after each installation</li>
        </ul>
      </section>

      <section id="apply" className={s.apply}>
        <div>
          <h2 className={s.h2}>Apply to join</h2>
          <p className={s.lead}>Tell us about your firm. We reply within two working days and arrange a short call.</p>
        </div>
        <InstallerApply />
      </section>
    </>
  );
}
