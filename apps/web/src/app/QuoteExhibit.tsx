import { batteryPriceGbp, solarPriceGbp } from '@soltara/engine';
import { gbp } from '@/lib/format';
import { sampleAssessment } from '@/lib/sample';
import s from './home.module.css';

/**
 * Example of the standard quote comparison. Installers and prices are ILLUSTRATIVE (labelled on the page),
 * priced from the engine's price book with typical installer differences, so the numbers stay consistent.
 */
// Same panel layout as the example home the engine recommends above, so the page never contradicts itself.
const { recommended } = sampleAssessment();
const count = recommended.design.panelCount;
const watts = recommended.design.panelWatts;
const kWp = (count * watts) / 1000;
const base = solarPriceGbp(kWp);
const PANELS = `${count} × ${watts}W`;
const quotes = [
  {
    name: 'Installer A', panels: PANELS, battery: '5 kWh', inverter: 'Hybrid, 5 kW', panelWarranty: '25 years',
    workmanship: '10 years', start: '3 weeks', price: Math.round((base + batteryPriceGbp(5, true)) * 0.98 / 10) * 10,
  },
  {
    name: 'Installer B', panels: PANELS, battery: '9.5 kWh', inverter: 'Hybrid, 5 kW', panelWarranty: '25 years',
    workmanship: '10 years', start: '5 weeks', price: Math.round((base + batteryPriceGbp(9.5, true)) / 10) * 10,
  },
  {
    name: 'Installer C', panels: PANELS, battery: '5 kWh', inverter: 'Hybrid, 3.6 kW', panelWarranty: '12 years',
    workmanship: '2 years', start: '2 weeks', price: Math.round((base + batteryPriceGbp(5, true)) * 1.14 / 10) * 10,
  },
];

export default function QuoteExhibit() {
  return (
    <section className={s.quotes} aria-labelledby="quotes-title">
      <header className={s.sectionHead}>
        <div>
          <p className="kicker" data-reveal>Three quotes, one format</p>
          <h2 id="quotes-title" className={s.h2} data-reveal style={{ ['--i' as string]: 1 }}>Differences you can <em>actually see.</em></h2>
        </div>
        <div data-reveal style={{ ['--i' as string]: 2 }}>
          <p className={s.lead}>
            Every installer quotes on the same form, with the same lines and the same units. A bigger battery or a longer
            warranty is obvious, and so is a price that’s out of line.
          </p>
          <p className={s.exhibitNote}>Example only: installers and prices are illustrative.</p>
        </div>
      </header>
      <p className={s.swipe} aria-hidden="true">Swipe to compare all three</p>
      <div className={s.quoteGrid} data-reveal role="table" aria-label="Example quote comparison" tabIndex={0}>
        <div className={s.qRow} role="row">
          <span role="columnheader" className={s.qHead}><span className="sr-only">Quote line</span></span>
          {quotes.map((q) => <span key={q.name} role="columnheader" className={s.qHead}>{q.name}<small>MCS · RECC</small></span>)}
        </div>
        {([
          ['Price', (q: typeof quotes[number]) => gbp(q.price), true],
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
                  {flagged && <small>{label === 'Price' ? 'Over 10% more than a quote for similar kit' : 'Below the other quotes'}</small>}
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
