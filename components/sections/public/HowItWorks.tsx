
'use client';

import { useState } from 'react';
import { HOME_BUYER_STEPS, DEVELOPER_STEPS, } from '@/data/howItWorks';
import { HowItWorksStepCard } from '@/components/cards/public/howitworks';
import { HowItWorksRole } from '@/type/howItWorks';
import { Button } from '@/components/primitives/Button';

export const HowItWorksSection: React.FC = () => {
  const [role, setRole] = useState<HowItWorksRole>('homebuyer');

  const steps =
    role === 'homebuyer' ? HOME_BUYER_STEPS : DEVELOPER_STEPS;

  return (
    <section className="py-36 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm font-medium text-secondary">
            Your Path to Global Homeownership
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-heading sm:text-4xl">
            How Ariveasy Works
          </h2>

          <p className="mt-4 text-secondary text-base">
            Ariveasy simplifies the home buying process, making it accessible
            and transparent for every aspiring homeowner.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-lg border border-border bg-card p-1">
            <Button
              variant={role === 'homebuyer' ? 'filled' : 'ghost'}
              size="sm"
              onClick={() => setRole('homebuyer')}
            >
              Homebuyer
            </Button>
            <Button
              variant={role === 'developer' ? 'filled' : 'ghost'}
              size="sm"
              onClick={() => setRole('developer')}
            >
              Developer
            </Button>
          </div>
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
