import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const alt = 'Soltara Energy — the UK Home Energy Marketplace';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const emblem = await readFile(path.join(process.cwd(), 'public/brand/soltara-emblem.png'));
  const word = await readFile(path.join(process.cwd(), 'public/brand/soltara-wordmark-white.png'));
  const emblemSrc = `data:image/png;base64,${emblem.toString('base64')}`;
  const wordSrc = `data:image/png;base64,${word.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '64px 72px', background: '#1c1e25', color: '#fff', fontFamily: 'sans-serif', position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', right: -160, top: -220, width: 720, height: 720, borderRadius: 360, background: 'radial-gradient(circle, rgba(40,87,236,0.55) 0%, rgba(40,87,236,0) 70%)' }} />
        <div style={{ position: 'absolute', left: -200, bottom: -300, width: 640, height: 640, borderRadius: 320, background: 'radial-gradient(circle, rgba(240,102,71,0.35) 0%, rgba(240,102,71,0) 70%)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img src={emblemSrc} width={110} height={80} alt="" />
          <img src={wordSrc} width={300} height={43} alt="" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1, letterSpacing: -2, maxWidth: 900 }}>
            Find the right energy system for your home.
          </div>
          <div style={{ fontSize: 30, color: '#c3c7d0', maxWidth: 860 }}>
            Compare solar, batteries and trusted installers in one place. Free, independent, and nobody calls until you choose.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          {['Independent', 'MCS-certified installers only', 'Three installers at most', 'Free for homeowners'].map((t) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.08)', fontSize: 22, fontWeight: 700 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: '#f06647' }} />
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
