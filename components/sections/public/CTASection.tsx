'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/primitives/Button';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  title = 'Ready to own your home?',
  subtitle = 'Your journey to homeownership starts here.',
  ctaLabel = 'Get Started',
  ctaHref = '/signup',
}) => {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-hover" />

      <div className="relative mx-auto max-w-4xl px-4 py-24 sm:px-6 sm:py-32 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-heading sm:text-4xl lg:text-5xl">
          Ready to own your
          <span className="block text-accent mt-2">home?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base text-secondary sm:text-lg">
          {subtitle}
        </p>
        
        <div className="mt-10 flex justify-center">
          <Button
            size="lg"
            variant="filled"
            onClick={() => router.push(ctaHref)}
          >
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
};
