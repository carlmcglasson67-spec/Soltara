import type { Metadata } from 'next';
import AssessmentTool from './AssessmentTool';

export const metadata: Metadata = {
  title: 'See what your home could save',
  description:
    'A free, two-minute assessment of solar and battery options for your home, with savings, price and payback shown as honest ranges. No phone number needed.',
  alternates: { canonical: '/assessment' },
};

export default function AssessmentPage() {
  return <AssessmentTool />;
}
