import { batteryPriceGbp, solarPriceGbp } from '@soltara/engine';
import { gbp } from '@/lib/format';
import s from './home.module.css';

/**
 * Example of the standard quote comparison. Installers and prices are ILLUSTRATIVE (labelled on the page),
 * priced from the engine's price book with typical installer differences, so the numbers stay consistent.
 */
const kWp = 4.55; // 10 x 455W
const base = solarPriceGbp(kWp);
const quotes = [
  {
    name: 'Installer A', panels: '10 × 455W', battery: '5 kWh', inverter: 'Hybrid, 5 kW', panelWarranty: '25 years',
    workmanship: '10 years', start: '3 weeks', price: Math.round((base + batteryPriceGbp(5, true)) * 0.98 / 10) * 10,
  },
  {
    name: 'Installer B', panels: '10 × 455W', battery: '9.5 kWh', inverter: 'Hybrid, 5 kW', panelWarranty: '25 years',
    workmanship: '10 years', start: '5 weeks', price: Math.round((base + batteryPriceGbp(9.5, true)) / 10) * 10,
  },
  {
    name: 'Installer C', panels: '10 × 455W', battery: '5 kWh', inverter: 'Hybrid, 3.6 kW', panelWarranty: '12 years',
    workmanship: '2 years', start: '2 weeks', price: Math.round((base + batteryPriceGbp(5, true)) * 1.14 / 10) * 10,
  },
];
const perKwp = (p: number) => Math.round(p / kWp);

export default function QuoteExhibit() {
  return (
    <section className={s.quotes} aria-labelledby="quotes-title">
      <div className={s.quotesIntro}>
        <h2 id="quotes-title" className={s.h2}>Three quotes, one format. Differences you can actually see.</h2>
        <p className={s.lead}>
          Every installer quotes on the same form: the same lines, the same units. So a bigger battery or a longer warranty is
          obvious, and so is a price that’s out of line.
        </p>
        <p className={s.exhibitNote}>Example only: installers and prices are illustrative.</p>
      </div>
      <div className={s.quoteGrid} role="table" aria-label="Example quote comparison">
        <div className={s.qRow} role="row">
          <span role="columnheader" className={s.qHead} />
          {quotes.map((q) => <span key={q.name} role="columnheader" className={s.qHead}>{q.name}<small>MCS · RECC</small></span>)}
        </div>
        {([
          ['Price', (q: typeof quotes[number]) => gbp(q.price), true],
          ['Price per kWp', (q: typeof quotes[number]) => gbp(perKwp(q.price)), true],
          ['Panels', (q: typeof quotes[number]) => q.panels, false],
          ['Battery', (q: typeof quotes[number]) => q.battery, false],
          ['Inverter', (q: typeof quotes[number]) => q.inverter, false],
          ['Panel warranty', (q: typeof quotes[number]) => q.panelWarranty, false],
          ['Workmanship warranty', (q: typeof quotes[number]) => q.workmanship, false],
          ['Can start in', (q: typeof quotes[number]) => q.start, false],
        ] as const).map(([label, get, fig]) => (
          <div key={label} className={s.qRow} role="row">
            <span role="rowheader" className={s.qLabel}>{label}</span>
            {quotes.map((q) => {
              const sameKitCheaper = quotes.some((o) => o !== q && o.battery === q.battery && o.panels === q.panels && o.price < q.price * 0.9);
              const flagged = (label === 'Price' && sameKitCheaper) || (label === 'Workmanship warranty' && q.workmanship === '2 years') || (label === 'Panel warranty' && q.panelWarranty === '12 years');
              const better = label === 'Battery' && q.battery === '9.5 kWh';
              return (
                <span key={q.name} role="cell" className={`${fig ? 'fig ' : ''}${s.qCell} ${flagged ? s.qFlag : ''} ${better ? s.qGood : ''}`}>
                  {get(q)}
                  {flagged && <small>{label === 'Price' ? 'Over 10% more than a quote for the same kit' : 'Below the other quotes'}</small>}
                  {better && <small>Nearly twice the storage</small>}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
