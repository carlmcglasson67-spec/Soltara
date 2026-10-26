/** Small line icons drawn in-house so the trust marks share one weight and the brand's coral accent. */
const PATHS: Record<string, React.ReactNode> = {
  scales: (
    <>
      <path d="M12 3v18M5 21h14M12 6l-6 2 6-2 6 2" />
      <path d="M3 13l3-5 3 5a3 3 0 0 1-6 0zM15 13l3-5 3 5a3 3 0 0 1-6 0z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" className="accent" />
    </>
  ),
  three: (
    <>
      <circle cx="7" cy="8" r="2.5" /><circle cx="17" cy="8" r="2.5" /><circle cx="12" cy="16" r="2.5" className="accent" />
      <path d="M2.5 20a4.5 4.5 0 0 1 9 0M12.5 20a4.5 4.5 0 0 1 9 0" />
    </>
  ),
  free: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5a2.5 2.5 0 0 0-5 0v5a2.5 2.5 0 0 0 5 0M8 12h5" className="accent" />
    </>
  ),
  home: (
    <>
      <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9z" />
      <path d="M8 4h2v3" className="accent" />
    </>
  ),
  form: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
      <path d="M15 15.5l1.5 1.5 3-3" className="accent" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 16v-5M12 16V8M16 16v-3" />
      <path d="M8 9l4-3 4 2 4-4" className="accent" />
    </>
  ),
  phoneOff: (
    <>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1.5 1.5 0 0 1-1.5 1.5C10 20.5 3.5 14 3.5 5.5A1.5 1.5 0 0 1 5 4z" />
      <path d="M4 4l16 16" className="accent" />
    </>
  ),
  pound: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9a2.5 2.5 0 0 0-5 0v4.5L8.5 16H15M8.5 12.5H13" className="accent" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="16" r="1.3" className="accent" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" className="accent" />,
  badge: (
    <>
      <path d="M12 2.5l2.3 2 3-.3.9 2.9 2.6 1.5-1.3 2.7 1.3 2.7-2.6 1.5-.9 2.9-3-.3-2.3 2-2.3-2-3 .3-.9-2.9-2.6-1.5 1.3-2.7-1.3-2.7 2.6-1.5.9-2.9 3 .3z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" className="accent" />
    </>
  ),
};

export default function Icon({ name, size = 28 }: { name: keyof typeof PATHS | string; size?: number }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
