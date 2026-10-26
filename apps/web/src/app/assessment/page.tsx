import type { Metadata } from 'next';
import AssessmentTool from './AssessmentTool';
import s from './assessment.module.css';

export const metadata: Metadata = {
  title: 'See what your home could save',
  description:
    'A free, two-minute assessment of solar and battery options for your home, with savings, price and payback shown as honest ranges. No phone number needed.',
};

export default function AssessmentPage() {
  return (
    <div className={s.page}>
      <header className={s.intro}>
        <div>
          <p className="kicker">Free home energy assessment</p>
          <h1 className={s.title}>See what your home could save.</h1>
        </div>
        <div>
          <p className={s.lead}>
            Answer a few questions about your home. You get every option that suits your roof, with savings, price and payback as
            ranges. No phone number, and nothing is shared unless you ask for quotes.
          </p>
          <ul className={`pills ${s.pills}`} aria-label="What to expect">
            <li className="pill pill-day">Two minutes</li>
            <li className="pill pill-day">Real satellite sun data</li>
            <li className="pill pill-day">Nothing saved or shared</li>
          </ul>
        </div>
      </header>
      <AssessmentTool />
    </div>
  );
}
