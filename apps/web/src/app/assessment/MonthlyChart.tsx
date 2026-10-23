import type { MonthResult } from '@soltara/engine';
import s from './chart.module.css';

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Month-by-month bars, built in HTML so labels stay readable at any width:
 *  what the home uses (grey), how much of that its own solar covers (blue), and total generation (amber tick). */
export default function MonthlyChart({ months }: { months: MonthResult[] }) {
  const max = Math.max(...months.map((m) => Math.max(m.loadKwh, m.generationKwh)));
  const step = max > 600 ? 200 : max > 300 ? 100 : 50;
  const ceil = Math.ceil(max / step) * step;
  const pctOf = (v: number) => `${(v / ceil) * 100}%`;
  const ticks = Array.from({ length: ceil / step + 1 }, (_, i) => ceil - i * step);
  const best = months.reduce((b, m, i) => (m.generationKwh > months[b]!.generationKwh ? i : b), 0);
  const worst = months.reduce((b, m, i) => (m.generationKwh < months[b]!.generationKwh ? i : b), 0);

  return (
    <figure className={s.figure}>
      <div className={s.chart} role="img"
        aria-label={`Monthly solar against electricity use. Most solar in ${MONTH_NAMES[best]} (${Math.round(months[best]!.generationKwh)} kWh), least in ${MONTH_NAMES[worst]} (${Math.round(months[worst]!.generationKwh)} kWh).`}>
        <div className={s.axis} aria-hidden="true">
          {ticks.map((t) => <span key={t} style={{ bottom: pctOf(t) }}>{t}</span>)}
        </div>
        <div className={s.plot} aria-hidden="true">
          <div className={s.gridLayer}>{ticks.map((t) => <i key={t} className={s.grid} style={{ bottom: pctOf(t) }} />)}</div>
          {months.map((m, i) => (
            <div key={i} className={s.col} title={`${MONTH_NAMES[i]}: you use ${Math.round(m.loadKwh)} kWh, solar covers ${Math.round(m.solarUsedKwh)} kWh, panels make ${Math.round(m.generationKwh)} kWh`}>
              <div className={s.bars}>
                <span className={s.use} style={{ height: pctOf(m.loadKwh) }} />
                <span className={s.covered} style={{ height: pctOf(m.solarUsedKwh) }} />
                <span className={s.gen} style={{ bottom: pctOf(m.generationKwh) }} />
              </div>
              <span className={s.month}>{MONTHS[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <figcaption className={s.legend}>
        <span><i className={s.keyUse} />Electricity you use</span>
        <span><i className={s.keyCovered} />Covered by your own solar</span>
        <span><i className={s.keyGen} />Total your panels make (the rest is exported)</span>
        <span className={s.unit}>Figures in kWh</span>
      </figcaption>
    </figure>
  );
}
