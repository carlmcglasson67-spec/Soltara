import Link from 'next/link';
import s from './legal.module.css';

export default function NotFound() {
  return (
    <section className={`${s.lost} grain`} data-surface="dark">
      <p className={s.lostCode} aria-hidden="true">404</p>
      <p className="kicker kicker-light">Page not found</p>
      <h1 className={s.lostTitle}>That page isn’t <em>on the roof.</em></h1>
      <p className={s.lead}>The link may be old or mistyped. The assessment is the best place to start, and it takes about two minutes.</p>
      <div className={s.lostActions}>
        <Link className="btn btn-sun btn-arrow" href="/assessment">Check my home</Link>
        <Link className="btn btn-ghost" href="/">Back to the homepage</Link>
      </div>
    </section>
  );
}
