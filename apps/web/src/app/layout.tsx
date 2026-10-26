import type { Metadata } from 'next';
import Link from 'next/link';
import '@fontsource-variable/archivo/wdth.css';
import './globals.css';
import Nav from './Nav';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  icons: { icon: '/brand/soltara-emblem.png', apple: '/brand/soltara-emblem.png' },
  title: { default: 'Soltara Energy — compare solar, batteries and trusted installers', template: '%s | Soltara Energy' },
  description:
    'Find the right energy system for your home. A free, independent assessment of what solar and batteries could save, then comparable quotes from vetted installers. Nobody calls until you choose.',
  openGraph: {
    type: 'website', siteName: SITE.name, locale: 'en_GB',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Soltara Energy — the UK Home Energy Marketplace' }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();
  return (
    <html lang="en-GB">
      <body>
        <header className="site-header">
          <Link href="/" className="brand" aria-label="Soltara Energy home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand-emblem" src="/brand/soltara-emblem.png" alt="" width={302} height={221} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand-word" src="/brand/soltara-wordmark.png" alt="Soltara Energy" width={560} height={80} />
          </Link>
          <Nav />
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="footer-grid">
            <div>
              <p className="footer-brand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="brand-emblem" src="/brand/soltara-emblem.png" alt="" width={302} height={221} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="brand-word" src="/brand/soltara-wordmark-white.png" alt="Soltara Energy" width={560} height={80} />
              </p>
              <p className="footer-tag">
                The UK Home Energy Marketplace. Independent assessments for homes across Great Britain, and comparable quotes
                from vetted, MCS-certified installers.
              </p>
              <p className="footer-cta"><Link className="btn btn-sun btn-arrow" href="/assessment">Check my home</Link></p>
            </div>
            <div>
              <p className="footer-head">Homeowners</p>
              <ul>
                <li><Link href="/assessment">Check my home</Link></li>
                <li><Link href="/#how-it-works">How it works</Link></li>
                <li><Link href="/how-we-make-money">How we make money</Link></li>
                <li><Link href="/warm-homes-loans">Warm Homes Loan Scheme</Link></li>
              </ul>
            </div>
            <div>
              <p className="footer-head">Installers</p>
              <ul>
                <li><Link href="/for-installers">Join as a founding installer</Link></li>
                <li><Link href="/for-installers#verified">Soltara Verified</Link></li>
                <li><Link href="/for-installers#terms">Founding terms</Link></li>
              </ul>
            </div>
            <div>
              <p className="footer-head">Company</p>
              <ul>
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms of use</Link></li>
                {SITE.email && <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>}
              </ul>
            </div>
          </div>
          <p className="footer-small">
            Savings and prices on this site are estimates shown as ranges, based on the assumptions listed with each result.
            A site survey by an MCS-certified installer confirms the design and price before you commit to anything. Soltara
            does not lend money or arrange finance.
          </p>
          <div className="footer-bottom">
            <p>© {year} {SITE.legalName}. All rights reserved.</p>
            <p className="footer-credit">Built and maintained by <a href={SITE.builder.url} rel="noopener"><strong>{SITE.builder.name}</strong></a></p>
          </div>
        </footer>
      </body>
    </html>
  );
}
