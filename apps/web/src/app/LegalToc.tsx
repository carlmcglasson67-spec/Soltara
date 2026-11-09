'use client';

import { useEffect, useState } from 'react';
import s from './legal.module.css';

/** Contents rail for long reading pages: marks the section you're in as you scroll. */
export default function LegalToc({ sections }: { sections: { id: string; title: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.3;
      let current = sections[0]?.id;
      for (const x of sections) {
        const el = document.getElementById(x.id);
        if (el && el.getBoundingClientRect().top <= line) current = x.id;
      }
      setActive(current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [sections]);
  return (
    <nav className={s.toc} aria-label="On this page">
      <p className={s.tocHead}>On this page</p>
      <ol>
        {sections.map((x, n) => (
          <li key={x.id}>
            <a href={`#${x.id}`} aria-current={active === x.id ? 'location' : undefined}>
              <span className="fig">{String(n + 1).padStart(2, '0')}</span>{x.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
