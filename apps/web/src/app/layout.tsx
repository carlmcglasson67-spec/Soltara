import type { Metadata } from 'next';
import Link from 'next/link';
import '@fontsource-variable/archivo/wdth.css';
import './globals.css';

export const metadata: Metadata = {
  icons: { icon: '/brand/soltara-emblem.png' },
  title: { default: 'Soltara Energy — compare solar, batteries and trusted installers', template: '%s | Soltara Energy' },
  description:
    'Find the right energy system for your home. A free, independent assessment of what solar and batteries could save, then comparable quotes from vetted installers. Nobody calls until you choose.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand-emblem" src="/brand/soltara-emblem.png" alt="" width={302} height={221} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand-word" src="/brand/soltara-wordmark.png" alt="Soltara Energy" width={560} height={80} />
          </Link>
          <nav className="site-nav" aria-label="Main">
            <Link className="nav-link" href="/#how-it-works">How it works</Link>
            <Link className="nav-link" href="/for-installers">For installers</Link>
            <Link className="nav-link" href="/how-we-make-money">How we make money</Link>
            <Link className="btn btn-primary" href="/assessment">Check my home</Link>
          </nav>
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
              <p style={{ marginTop: '.6rem', maxWidth: '42ch' }}>
                Independent home energy assessments for homes across Great Britain, and comparable quotes from vetted, MCS-certified installers.
              </p>
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 650 }}>Homeowners</p>
              <ul>
                <li><Link href="/assessment">Check my home</Link></li>
                <li><Link href="/#how-it-works">How it works</Link></li>
                <li><Link href="/how-we-make-money">How we make money</Link></li>
                <li><Link href="/warm-homes-loans">Warm Homes Loan Scheme</Link></li>
              </ul>
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 650 }}>Installers</p>
              <ul>
                <li><Link href="/for-installers">Join as a founding installer</Link></li>
                <li><Link href="/for-installers#verified">Soltara Verified</Link></li>
              </ul>
            </div>
          </div>
          <p className="footer-small">
            Savings and prices on this site are estimates shown as ranges, based on the assumptions listed with each result.
            A site survey by an MCS-certified installer confirms the design and price before you commit to anything.
          </p>
        </footer>
      </body>
    </html>
  );
}
