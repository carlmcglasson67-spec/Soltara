import Icon from './Icon';
import s from './inner.module.css';

/** The Soltara Verified seal: a slowly turning ring of text around the badge. Decorative; the checks are listed in text. */
export default function Seal() {
  return (
    <div className={s.seal} aria-hidden="true">
      <svg className={s.ring} viewBox="0 0 200 200">
        <defs><path id="seal-ring" d="M100 100 m-82 0 a82 82 0 1 1 164 0 a82 82 0 1 1 -164 0" /></defs>
        <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeOpacity=".25" />
        <circle cx="100" cy="100" r="66" fill="none" stroke="currentColor" strokeOpacity=".25" />
        <text fontFamily="var(--mono)" fontSize="12.5" letterSpacing="4.2" fill="currentColor">
          <textPath href="#seal-ring">SOLTARA VERIFIED · CHECKED EVERY YEAR · MCS CERTIFIED ·</textPath>
        </text>
      </svg>
      <span className={s.core}><Icon name="badge" size={52} /></span>
    </div>
  );
}
