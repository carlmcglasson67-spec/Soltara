import Link from 'next/link';
import s from './legal.module.css';

export default function NotFound() {
  return (
    <section className={s.lost}>
      <p className="kicker">Page not found</p>
      <h1 className={s.lostTitle}>That page isn’t on the roof.</h1>
      <p className={s.lead} style={{ maxWidth: '46ch' }}>The link may be old or mistyped. The assessment is the best place to start, and it takes about two minutes.</p>
      <div className={s.lostActions}>
        <Link className="btn btn-primary btn-arrow" href="/assessment">Check my home</Link>
        <Link className="btn btn-quiet" href="/">Back to the homepage</Link>
      </div>
    </section>
  );
}
