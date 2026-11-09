'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const TABS = [
  { href: '/', label: 'Home', match: (p: string) => p === '/' },
  { href: '/#how-it-works', label: 'How it works', match: () => false },
  { href: '/for-installers', label: 'For installers', match: (p: string) => p.startsWith('/for-installers') },
  { href: '/how-we-make-money', label: 'How we make money', match: (p: string) => p.startsWith('/how-we-make-money') },
];

/** Main navigation. On desktop a single dark pip slides between tabs: it rests on the current page
 *  and follows the pointer, so the bar reads as one engineered control rather than four links. */
export default function Nav() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const pipRef = useRef<HTMLSpanElement>(null);
  const current = TABS.findIndex((t) => t.match(pathname));
  const target = hover ?? (current >= 0 ? current : null);

  useEffect(() => { setOpen(false); }, [pathname]);

  const place = useCallback(() => {
    const bar = tabsRef.current; const pip = pipRef.current;
    if (!bar || !pip) return;
    const link = target == null ? null : bar.querySelectorAll<HTMLAnchorElement>('.nav-link')[target];
    if (!link) { pip.style.opacity = '0'; return; }
    pip.style.opacity = '1';
    pip.style.width = `${link.offsetWidth}px`;
    pip.style.transform = `translateX(${link.offsetLeft}px)`;
  }, [target]);

  useLayoutEffect(() => { place(); }, [place]);
  useEffect(() => {
    window.addEventListener('resize', place);
    document.fonts?.ready.then(place).catch(() => {});
    return () => window.removeEventListener('resize', place);
  }, [place]);

  return (
    <nav className="site-nav" aria-label="Main">
      <div className="nav-tabs" ref={tabsRef} onMouseLeave={() => setHover(null)}>
        <span className="nav-pip" ref={pipRef} aria-hidden="true" />
        {TABS.map((t, i) => (
          <Link key={t.href} className="nav-link" href={t.href}
            aria-current={t.match(pathname) ? 'page' : undefined}
            data-active={target === i}
            onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}>
            {t.label}
          </Link>
        ))}
      </div>
      <Link className="btn btn-primary btn-arrow" href="/assessment">Check my home</Link>
      <button className="nav-burger" type="button" aria-expanded={open} aria-controls="nav-sheet" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
        <span />
      </button>
      {open && (
        <div id="nav-sheet" className="nav-sheet">
          {TABS.map((t) => (
            <Link key={t.href} className="nav-link" href={t.href} aria-current={t.match(pathname) ? 'page' : undefined}>{t.label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}
