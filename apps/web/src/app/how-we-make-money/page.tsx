import type { Metadata } from 'next';
import Link from 'next/link';
import Icon from '../Icon';
import s from './money.module.css';

export const metadata: Metadata = {
  title: 'How we make money',
  description: 'Soltara is free for homeowners. Installers pay us when we book a survey for them. Payment never changes how quotes are shown.',
};

const POINTS = [
  { icon: 'pound', title: 'Free for homeowners', body: 'You never pay Soltara anything, whether or not you go ahead. No fees, no subscription, nothing hidden in the installer’s price.' },
  { icon: 'form', title: 'Installers pay per booked survey', body: 'An installer pays us when we book a site survey for them. Founding installers pay nothing until we are booking surveys regularly.' },
  { icon: 'scales', title: 'Payment never buys a better position', body: 'Quotes are shown on the same form, in an order you control. No installer can pay to be recommended, promoted or shown first.' },
  { icon: 'lock', title: 'Your details are never sold', body: 'Your assessment goes to at most three installers, and only the ones you choose. Nobody calls until you ask them to.' },
];

const NEVER = [
  'Sell your details to anyone',
  'Take a commission that changes the recommendation',
  'Let an installer pay for a higher ranking',
  'Show a “guaranteed saving” — every figure is a range with its assumptions',
  'Arrange finance or promise grant eligibility',
];

export default function HowWeMakeMoney() {
  return (
    <>
      <section className={`${s.hero} band-dark glow`}>
        <div className={s.heroText}>
          <p className="kicker kicker-light">How we make money</p>
          <h1 className={s.title}>Free for you. Installers pay when we book them real work.</h1>
          <p className={s.lead}>
            Comparison sites usually make money in ways they don’t explain. Here is exactly how Soltara does, so you can judge
            our recommendations for yourself.
          </p>
        </div>
        <dl className={s.heroStats}>
          <div><dt>Cost to homeowners</dt><dd className="fig">£0</dd></div>
          <div><dt>Installers see your details</dt><dd className="fig">3 max</dd></div>
          <div><dt>Paid placement</dt><dd className="fig">None</dd></div>
        </dl>
      </section>

      <section className={s.points}>
        <ul>
          {POINTS.map((p, i) => (
            <li key={p.title}>
              <span className={s.num}>0{i + 1}</span>
              <Icon name={p.icon} size={30} />
              <h2>{p.title}</h2>
              <p>{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.never}>
        <div>
          <p className="kicker">In writing</p>
          <h2 className={s.h2}>What we will never do.</h2>
          <p className={s.leadDark}>If any of these ever changes, this page changes first.</p>
        </div>
        <ul className={s.neverList}>
          {NEVER.map((n) => (
            <li key={n}><Icon name="phoneOff" size={22} />{n}</li>
          ))}
        </ul>
      </section>

      <section className={`${s.cta} band-blue glow`}>
        <div>
          <p className="kicker kicker-blue">Free, two minutes, no phone number</p>
          <h2 className={s.ctaTitle}>See what your home could save.</h2>
        </div>
        <Link className="btn btn-sun btn-lg btn-arrow" href="/assessment">Check my home</Link>
      </section>
    </>
  );
}
