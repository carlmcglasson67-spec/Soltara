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
  const [ready, setReady] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const pipRef = useRef<HTMLSpanElement>(null);
  const current = TABS.findIndex((t) => t.match(pathname));
  const target = hover ?? (current >= 0 ? current : null);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { setReady(true); }, []);

  // Mobile sheet: focus moves in on open; Escape or a tap outside closes it and returns focus to the button.
  useEffect(() => {
    if (!open) return;
    sheetRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const close = () => { setOpen(false); burgerRef.current?.focus(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!sheetRef.current?.contains(t) && !burgerRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); };
  }, [open]);

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
      <div className="nav-tabs" ref={tabsRef} data-ready={ready || undefined} onMouseLeave={() => setHover(null)}>
        <span className="nav-pip" ref={pipRef} aria-hidden="true" />
        {TABS.map((t, i) => (
          <Link key={t.href} className="nav-link" href={t.href}
            aria-current={t.match(pathname) ? 'page' : undefined}
            data-active={ready && target === i}
            onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}>
            {t.label}
          </Link>
        ))}
      </div>
      <Link className="btn btn-primary btn-arrow" href="/assessment">Check my home</Link>
      <button ref={burgerRef} className="nav-burger" type="button" aria-expanded={open} aria-controls="nav-sheet" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
        <span />
      </button>
      <div id="nav-sheet" className="nav-sheet" ref={sheetRef} hidden={!open}>
        {TABS.map((t) => (
          <Link key={t.href} className="nav-link" href={t.href} aria-current={t.match(pathname) ? 'page' : undefined} onClick={() => setOpen(false)}>{t.label}</Link>
        ))}
      </div>
    </nav>
  );
}
