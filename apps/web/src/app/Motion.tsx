'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Site-wide motion driver. One IntersectionObserver reveals anything marked
 * [data-reveal] / [data-reveal-img] and runs count-ups on [data-count].
 * Without JS (or with reduced motion) everything is simply visible — see globals.css.
 */
export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-img], [data-count]'));

    const run = (el: HTMLElement) => {
      if (el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'in');
      if (el.hasAttribute('data-reveal-img')) el.setAttribute('data-reveal-img', 'in');
      if (el.hasAttribute('data-count') && !el.dataset.counted) {
        el.dataset.counted = '1';
        const target = Number(el.dataset.count);
        const dec = Number(el.dataset.decimals ?? 0);
        if (reduce || !Number.isFinite(target)) return;
        const start = performance.now();
        const dur = 1600;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = (target * eased).toLocaleString('en-GB', { minimumFractionDigits: dec, maximumFractionDigits: dec });
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    };

    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { run(e.target as HTMLElement); io.unobserve(e.target); } }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
