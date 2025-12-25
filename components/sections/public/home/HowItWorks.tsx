
'use client';

import { useState } from 'react';
import { HOME_BUYER_STEPS, DEVELOPER_STEPS, TABS, } from '@/data/pages/public/howItWorks';
import { HowItWorksStepCard } from '@/components/cards/public/howitworks';
import { SectionHeading } from '@/components/common/SectionHeading';
import { SegmentedTabs } from '@/components/common/SegmentedTabs';

export const HowItWorksSection: React.FC = () => {
  const [tab, setTab] = useState('homebuyer');

  const steps = tab === 'homebuyer' ? HOME_BUYER_STEPS : DEVELOPER_STEPS;

  return (
    <section className="py-36 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Your Path to Global Homeownership"
          title="How Ariveasy Works"
          description="Ariveasy simplifies the home buying process, making it accessible and transparent for every aspiring homeowner."
          size="md"
        />

        <div className="mt-10 flex justify-center">
          <SegmentedTabs
            tabs={TABS}
            active={tab}
            onChange={setTab}
          />
        </div>

        <div className="mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <HowItWorksStepCard
              key={step.id}
              step={step}
              index={index}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
