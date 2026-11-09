'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

type Item = { href?: string; label: string; note: string; icon: string; soon?: boolean };
type Menu = { id: string; label: string; feature: { href: string; img: string; kicker: string; title: string; body: string }; cols: { head: string; items: Item[] }[] };

const MENUS: Menu[] = [
  {
    id: 'systems',
    label: 'Systems',
    feature: {
      href: '/assessment', img: '/img/battery-wall-900.webp', kicker: 'Free assessment',
      title: 'See every system your roof can take.', body: 'Two minutes. Satellite sun data. No phone number.',
    },
    cols: [
      {
        head: 'Available now',
        items: [
          { href: '/solar-panels', label: 'Solar panels', note: 'What your roof could generate', icon: 'panel' },
          { href: '/home-batteries', label: 'Home batteries', note: 'Store solar or cheap night rates', icon: 'battery' },
          { href: '/solar-panels#with-battery', label: 'Solar with a battery', note: 'Usually the best value over 20 years', icon: 'sun' },
        ],
      },
      {
        head: 'Coming to Soltara',
        items: [
          { label: 'EV chargers', note: 'Matched to your tariff and solar', icon: 'ev', soon: true },
          { label: 'Heat pumps', note: 'Sized to your home, not a brochure', icon: 'fan', soon: true },
        ],
      },
    ],
  },
  {
    id: 'guides',
    label: 'Guides',
    feature: {
      href: '/how-we-make-money', img: '/img/dormer-roof-sky-900.webp', kicker: 'In the open',
      title: 'How Soltara makes money.', body: 'Installers pay us. You never do. Here is exactly how.',
    },
    cols: [
      {
        head: 'Before you buy',
        items: [
          { href: '/#how-it-works', label: 'How it works', note: 'From postcode to fitted, in four steps', icon: 'form' },
          { href: '/#faq', label: 'Questions answered', note: 'Payback, planning, roofs, batteries', icon: 'book' },
          { href: '/#engine', label: 'How we work out your numbers', note: 'The data behind every range', icon: 'satellite' },
        ],
      },
      {
        head: 'Paying for it',
        items: [
          { href: '/warm-homes-loans', label: 'Warm Homes Loan Scheme', note: 'What we know so far', icon: 'pound' },
          { href: '/how-we-make-money', label: 'How we make money', note: 'Free for homeowners, and why', icon: 'scales' },
        ],
      },
    ],
  },
];

export default function Nav() {
  const pathname = usePathname() ?? '/';
  const [sheet, setSheet] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => { setSheet(false); setOpen(null); }, [pathname]);
  useEffect(() => {
    const header = document.querySelector('.site-header');
    const onScroll = () => {
      header?.setAttribute('data-scrolled', String(window.scrollY > 8));
      header?.setAttribute('data-over', String(window.location.pathname === '/' && window.scrollY < 60));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); setSheet(false); } };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey); };
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = sheet ? 'hidden' : '';
    document.querySelector('.site-header')?.setAttribute('data-sheet', String(sheet));
  }, [sheet]);

  const enter = (id: string) => { window.clearTimeout(closeTimer.current); setOpen(id); };
  const leave = () => { closeTimer.current = window.setTimeout(() => setOpen(null), 160); };

  return (
    <nav className="site-nav" aria-label="Main">
      <ul className="nav-tabs">
        {MENUS.map((m) => (
          <li key={m.id} onMouseEnter={() => enter(m.id)} onMouseLeave={leave}>
            <button className="nav-trigger" type="button" aria-expanded={open === m.id} aria-controls={`mega-${m.id}`}
              onClick={() => setOpen((o) => (o === m.id ? null : m.id))}>
              {m.label}
            </button>
            <div id={`mega-${m.id}`} className="mega" data-open={open === m.id}>
              <Link href={m.feature.href} className="mega-feature">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.feature.img} alt="" loading="lazy" />
                <span className="mono" style={{ color: '#ffd9cd' }}>{m.feature.kicker}</span>
                <strong>{m.feature.title}</strong>
                <span>{m.feature.body}</span>
              </Link>
              {m.cols.map((c) => (
                <div key={c.head} className="mega-col">
                  <span className="mono">{c.head}</span>
                  <ul>
                    {c.items.map((it) => {
                      const inner = (
                        <>
                          <span className="mega-ico"><Icon name={it.icon} size={22} /></span>
                          <span><b>{it.label}{it.soon && <span className="mega-soon">Soon</span>}</b><small>{it.note}</small></span>
                        </>
                      );
                      return (
                        <li key={it.label}>
                          {it.href ? <Link className="mega-item" href={it.href}>{inner}</Link> : <span className="mega-item" aria-disabled="true">{inner}</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </li>
        ))}
        <li>
          <Link className="nav-link" href="/for-installers" aria-current={pathname.startsWith('/for-installers') ? 'page' : undefined}>For installers</Link>
        </li>
        <li>
          <Link className="nav-link" href="/how-we-make-money" aria-current={pathname.startsWith('/how-we-make-money') ? 'page' : undefined}>How we make money</Link>
        </li>
      </ul>
      <Link className="btn btn-primary btn-arrow" href="/assessment">Check my home</Link>
      <button className="nav-burger" type="button" aria-expanded={sheet} aria-controls="nav-sheet" aria-label={sheet ? 'Close menu' : 'Open menu'} onClick={() => setSheet((o) => !o)}>
        <span />
      </button>
      {sheet && (
        <div id="nav-sheet" className="nav-sheet">
          {MENUS.map((m) => (
            <div key={m.id}>
              <p className="mono">{m.label}</p>
              <ul>
                {m.cols.flatMap((c) => c.items).filter((i) => i.href).map((i) => (
                  <li key={i.label}><Link href={i.href!}>{i.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="mono">Installers</p>
            <ul><li><Link href="/for-installers">Join as a founding installer</Link></li></ul>
          </div>
          <Link className="btn btn-sun btn-lg btn-arrow" href="/assessment">See what your home could save</Link>
        </div>
      )}
    </nav>
  );
}
