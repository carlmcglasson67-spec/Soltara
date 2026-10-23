import type { Metadata } from 'next';
import Link from 'next/link';
import '@fontsource-variable/archivo/wdth.css';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Soltara Energy — compare solar, batteries and trusted installers', template: '%s | Soltara Energy' },
  description:
    'Find the right energy system for your home. A free, independent assessment of what solar and batteries could save, then comparable quotes from vetted installers. Nobody calls until you choose.',
};

function Mark() {
  // A roof pitch over a sun line: the home, and the energy on it.
  return (
    <svg className="brand-mark" viewBox="0 0 26 26" aria-hidden="true">
      <path d="M2 14 L13 4 L24 14" fill="none" stroke="var(--navy)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M6 20 H20" stroke="var(--sun)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">
            <Mark />
            <span className="brand-name">Soltara</span>
            <span className="brand-sub">Energy</span>
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
              <p style={{ fontSize: '1.35rem', fontWeight: 750, color: '#fff' }}>Soltara Energy</p>
              <p style={{ marginTop: '.6rem', maxWidth: '42ch' }}>
                Independent home energy assessments and comparable installer quotes, starting in Cumbria and the North West.
              </p>
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 650 }}>Homeowners</p>
              <ul>
                <li><Link href="/assessment">Check my home</Link></li>
                <li><Link href="/#how-it-works">How it works</Link></li>
                <li><Link href="/how-we-make-money">How we make money</Link></li>
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
