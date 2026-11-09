'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Site-wide motion, in one small observer instead of an animation library:
 * - [data-reveal] elements rise in once when they enter the viewport (staggered by their --i).
 * - [data-count] numbers count up from zero when revealed.
 * - buttons get a light that follows the pointer (--mx / --my).
 * Everything respects prefers-reduced-motion via CSS; counters jump straight to their value.
 */
export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = (el: HTMLElement) => {
      const to = Number(el.dataset.count); const dp = Number(el.dataset.dp ?? 0);
      const fmt = (v: number) => v.toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp });
      if (reduce || !Number.isFinite(to)) { el.textContent = fmt(to); return; }
      const t0 = performance.now(); const dur = 1400;
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / dur); const e = 1 - Math.pow(1 - k, 4);
        el.textContent = fmt(to * e);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        el.classList.add('is-in');
        el.querySelectorAll<HTMLElement>('[data-count]').forEach(count);
        if (el.dataset.count) count(el);
        io.unobserve(el);
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

    const onMove = (ev: PointerEvent) => {
      const b = (ev.target as HTMLElement | null)?.closest?.('.btn') as HTMLElement | null;
      if (!b) return;
      const r = b.getBoundingClientRect();
      b.style.setProperty('--mx', `${ev.clientX - r.left}px`);
      b.style.setProperty('--my', `${ev.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => { io.disconnect(); document.removeEventListener('pointermove', onMove); };
  }, [pathname]);

  return null;
}
