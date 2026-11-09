import localFont from 'next/font/local';

/* Type system: Fraunces (display), Schibsted Grotesk (UI and body), IBM Plex Mono (readouts).
   Self-hosted through next/font so the files are preloaded and the fallback is size-matched (no layout shift).
   All three are SIL Open Font Licence. Latin subset only. */
export const display = localFont({
  src: [
    { path: '../fonts/fraunces-latin-opsz-normal.woff2', style: 'normal', weight: '100 900' },
    { path: '../fonts/fraunces-latin-opsz-italic.woff2', style: 'italic', weight: '100 900' },
  ],
  variable: '--font-display', display: 'swap', fallback: ['Georgia', 'serif'], adjustFontFallback: 'Times New Roman',
});
export const sans = localFont({
  src: [{ path: '../fonts/schibsted-grotesk-latin-wght-normal.woff2', style: 'normal', weight: '400 900' }],
  variable: '--font-sans', display: 'swap', fallback: ['system-ui', 'sans-serif'], adjustFontFallback: 'Arial',
});
export const mono = localFont({
  src: [
    { path: '../fonts/ibm-plex-mono-latin-400-normal.woff2', style: 'normal', weight: '400' },
    { path: '../fonts/ibm-plex-mono-latin-500-normal.woff2', style: 'normal', weight: '500' },
  ],
  variable: '--font-mono', display: 'swap', fallback: ['ui-monospace', 'monospace'], preload: false,
});
