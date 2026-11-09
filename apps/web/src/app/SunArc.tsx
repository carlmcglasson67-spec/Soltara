/**
 * The Soltara signature: the sun's path across a day, drawn as an instrument arc with hour ticks.
 * Purely decorative (aria-hidden). The stroke draws itself in once when the parent reveals.
 */
export default function SunArc({ className, tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  const stroke = tone === 'light' ? 'rgba(255,255,255,.55)' : 'rgba(28,30,37,.35)';
  const ticks = Array.from({ length: 13 }, (_, i) => {
    const a = Math.PI - (i / 12) * Math.PI;
    const r1 = 380, r2 = i % 3 === 0 ? 404 : 394;
    return { x1: 400 + r1 * Math.cos(a), y1: 420 - r1 * Math.sin(a), x2: 400 + r2 * Math.cos(a), y2: 420 - r2 * Math.sin(a), major: i % 3 === 0 };
  });
  const sunA = Math.PI * 0.38;
  return (
    <svg className={`sun-arc ${className ?? ''}`} viewBox="0 0 800 440" fill="none" aria-hidden="true">
      <path className="sun-arc-path" d="M20 420 A380 380 0 0 1 780 420" stroke={stroke} strokeWidth="1.2" pathLength={1} />
      <path d="M60 420 A340 340 0 0 1 740 420" stroke={stroke} strokeWidth=".6" strokeDasharray="2 7" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={stroke} strokeWidth={t.major ? 1.4 : .8} />
      ))}
      <circle className="sun-arc-sun" cx={400 + 380 * Math.cos(sunA)} cy={420 - 380 * Math.sin(sunA)} r="11" fill="#f06647" />
      <circle cx={400 + 380 * Math.cos(sunA)} cy={420 - 380 * Math.sin(sunA)} r="24" stroke="#f06647" strokeOpacity=".45" />
    </svg>
  );
}
