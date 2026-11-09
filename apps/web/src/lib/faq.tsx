import Link from 'next/link';
import type { ReactNode } from 'react';

/** Homepage FAQ. `text` is the plain version used in FAQPage structured data. */
export const FAQ: { q: string; a: ReactNode; text: string }[] = [
  {
    q: 'Is Soltara really free?',
    text: 'Yes. You never pay Soltara anything, whether or not you go ahead. Installers pay us when we book a site survey for them, and payment never changes how quotes are shown.',
    a: (
      <p>
        Yes. You never pay Soltara anything, whether or not you go ahead. Installers pay us when we book a site survey for them,
        and payment never changes how quotes are shown. <Link href="/how-we-make-money">How we make money</Link> sets it all out.
      </p>
    ),
  },
  {
    q: 'How accurate are the savings figures?',
    text: 'They are estimates shown as ranges. We use satellite sunlight data for your roof’s pitch and direction, simulate your home hour by hour across a year, and list every assumption. An MCS-certified installer confirms the design and price at a site survey before you commit to anything.',
    a: (
      <p>
        They’re estimates, so we show them as ranges. We use satellite sunlight data for your roof’s pitch and direction,
        simulate your home hour by hour across a whole year, and list every assumption next to the result. An MCS-certified
        installer confirms the design and price at a site survey before you commit to anything.
      </p>
    ),
  },
  {
    q: 'Will I get sales calls?',
    text: 'No. Your details go to three installers at most, and only the ones you choose. Nobody calls you before you choose them, and we never sell your details.',
    a: <p>No. Your details go to three installers at most, and only the ones you choose. Nobody calls you before you choose them, and we never sell your details.</p>,
  },
  {
    q: 'Is a battery worth it?',
    text: 'It depends on your home and tariff, which is why we show solar on its own next to solar with different batteries, and a battery on its own where your tariff has a cheap overnight rate. The comparison runs over 20 years, so you can see which gives the most back.',
    a: (
      <p>
        It depends on your home and your tariff, which is why we never answer it with a yes. You see solar on its own next to
        solar with different batteries, and a battery on its own where your tariff has a cheap overnight rate, compared over 20
        years. <Link href="/home-batteries">More on home batteries</Link>.
      </p>
    ),
  },
  {
    q: 'Do I need planning permission for solar panels?',
    text: 'Most roof-mounted panels on houses are permitted development, so they do not need planning permission. Listed buildings, flats and some homes in conservation areas are different. Your installer checks this at the survey.',
    a: (
      <p>
        Most roof-mounted panels on houses are permitted development, so they don’t need planning permission. Listed buildings,
        flats and some homes in conservation areas are different. Your installer checks this at the survey.
      </p>
    ),
  },
  {
    q: 'What does MCS-certified mean?',
    text: 'MCS is the UK certification scheme for small-scale renewable installations. An MCS-certified installation is normally needed to get paid for exported electricity under the Smart Export Guarantee. We only work with MCS-certified installers.',
    a: (
      <p>
        MCS is the UK certification scheme for small-scale renewable installations. An MCS-certified installation is normally
        needed to get paid for the electricity you export under the Smart Export Guarantee. We only work with MCS-certified installers.
      </p>
    ),
  },
  {
    q: 'What if there are no installers in my area yet?',
    text: 'You still get your full assessment. If no vetted installer covers your postcode yet, we tell you plainly rather than passing your details to someone we have not checked.',
    a: <p>You still get your full assessment. If no vetted installer covers your postcode yet, we tell you plainly rather than passing your details to someone we haven’t checked.</p>,
  },
];
