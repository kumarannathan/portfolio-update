import React from 'react';
import Specimen from './Specimen';
import { QuoteReader, PaymentCalculator, DealScore } from './ToshiDemos';
import { SegmentedDemo, RosterDemo, DoseEditor } from './YoggerDemos';
import { MetricRow, DotMatrix, FitPagerDemo } from './CrmDemos';

interface Entry {
  name: string;
  source: string;
  description: string;
  skin: 'toshi' | 'yogger' | 'crm';
  Component: React.FC;
}

/** Live components from each project, keyed by case-study id. */
const PLAYGROUND: Record<string, Entry[]> = {
  toshi: [
    {
      name: 'Quote reader',
      source: 'toshi/src/lib/parser.ts',
      description:
        'the rules-based first pass that runs before any ai: labeled amounts inside sane ranges, each with a confidence. edit the quote, or paste your own.',
      skin: 'toshi',
      Component: QuoteReader
    },
    {
      name: 'Deal score',
      source: 'toshi/src/lib/analyze.ts',
      description: 'every factor says why. push the doc fee past $799 or stretch the term to 84 months and watch the grade fall.',
      skin: 'toshi',
      Component: DealScore
    },
    {
      name: 'Payment calculator',
      source: 'toshi/src/lib/math.ts',
      description: 'the monthly payment, what the interest actually costs, and how slowly the balance falls on a long term.',
      skin: 'toshi',
      Component: PaymentCalculator
    }
  ],
  'yogger-web-redesign': [
    {
      name: 'Coach roster',
      source: 'Dashboard/Tasks/Coach',
      description: 'the tasks page rebuilt around the whole roster. filter who needs attention, pick an athlete, review what they sent.',
      skin: 'yogger',
      Component: RosterDemo
    },
    {
      name: 'Segmented control',
      source: 'components/SegmentedControl.tsx',
      description: 'the one context switch every redesigned page shares. the charcoal pill glides between labels.',
      skin: 'yogger',
      Component: SegmentedDemo
    }
  ],
  'yogger-crm': [
    {
      name: 'Dot matrix',
      source: 'crm/charts/dot-matrix.tsx',
      description:
        'one dot per slice of the day, so a spike reads as height and density at once. change the range and watch what a single dot is worth change with it.',
      skin: 'crm',
      Component: DotMatrix
    },
    {
      name: 'Metric card',
      source: 'crm/ui/metric-card.tsx',
      description: 'the number, its change against the last period, and a sparkline that goes red when the change does. the top row of every dashboard.',
      skin: 'crm',
      Component: MetricRow
    },
    {
      name: 'Fit pager',
      source: 'crm/ui/fit-pager.tsx',
      description: 'the reason no crm page scrolls: the list measures its own space, shows what fits, and pages the rest. drag the panel taller.',
      skin: 'crm',
      Component: FitPagerDemo
    }
  ],
  'home-exercise-builder': [
    {
      name: 'Exercise dose',
      source: 'Dashboard/HEP/models.ts',
      description: 'sets, reps, holds, rest, side and frequency, folded into the one line an athlete reads.',
      skin: 'yogger',
      Component: DoseEditor
    }
  ]
};

export function hasPlayground(id: string): boolean {
  return Boolean(PLAYGROUND[id]?.length);
}

/** Renders the live components for a case study, or nothing. */
export const Playground: React.FC<{ id: string }> = ({ id }) => {
  const entries = PLAYGROUND[id];
  if (!entries?.length) return null;
  return (
    <div className="playground">
      {entries.map(({ Component, ...meta }) => (
        <Specimen key={meta.name} {...meta}>
          <Component />
        </Specimen>
      ))}
    </div>
  );
};
