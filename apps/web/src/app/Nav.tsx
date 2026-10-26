'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const TABS = [
  { href: '/', label: 'Home', match: (p: string) => p === '/' },
  { href: '/#how-it-works', label: 'How it works', match: () => false },
  { href: '/for-installers', label: 'For installers', match: (p: string) => p.startsWith('/for-installers') },
  { href: '/how-we-make-money', label: 'How we make money', match: (p: string) => p.startsWith('/how-we-make-money') },
];

export default function Nav() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);

  const tabs = TABS.map((t) => (
    <Link key={t.href} className="nav-link" href={t.href} aria-current={t.match(pathname) ? 'page' : undefined}>
      {t.label}
    </Link>
  ));

  return (
    <nav className="site-nav" aria-label="Main">
      <div className="nav-tabs">{tabs}</div>
      <Link className="btn btn-primary btn-arrow" href="/assessment">Check my home</Link>
      <button className="nav-burger" type="button" aria-expanded={open} aria-controls="nav-sheet" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
        <span />
      </button>
      {open && <div id="nav-sheet" className="nav-sheet">{tabs}</div>}
    </nav>
  );
}
