import type { Metadata } from 'next';
import Link from 'next/link';
import s from '../for-installers/installers.module.css';

export const metadata: Metadata = {
  title: 'How we make money',
  description: 'Soltata is free for homeowners. Installers pay us when we help them win work. Payment never changes how quotes are shown.',
};

export default function HowWeMakeMoney() {
  return (
    <section className={s.split} style={{ minHeight: '70vh' }}>
      <h1 className={s.h2}>How we make money</h1>
      <dl className={s.points}>
        <div><dt>Free for homeowners</dt><dd>You never pay Soltata anything, whether or not you go ahead.</dd></div>
        <div><dt>Installers pay us</dt><dd>Installers pay when we book a survey for them. Founding installers pay nothing until we are booking surveys regularly.</dd></div>
        <div><dt>Payment never buys a better position</dt><dd>Quotes are shown on the same form, in an order you control. No installer can pay to be recommended or shown first.</dd></div>
        <div><dt>Your details are never sold</dt><dd>Your assessment goes to at most three installers, and only the ones you choose. <Link href="/assessment">Check your home</Link>.</dd></div>
      </dl>
    </section>
  );
}
