'use client'

import { Button } from '@/components/primitives/Button';
import Image from 'next/image';

interface DashboardWelcomeHeaderProps {
  name: string;
  title?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  illustrationSrc?: string;
}

export function DashboardWelcomeHeader({
  name,
  title = 'Welcome back',
  description = "Here's what's been happening with your applications and properties this week.",
  primaryAction,
  secondaryAction,
  illustrationSrc,
}: DashboardWelcomeHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-orange-50 border border-orange-100 mb-5">
      <div className="px-6 py-8 sm:px-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-heading">
              {title},{' '}
              <span className="text-orange-600">{name}</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm sm:text-base text-secondary">
              {description}
            </p>

            {(primaryAction || secondaryAction) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {secondaryAction && (
                  <Button
                    variant="outline"
                    onClick={secondaryAction.onClick}
                  >
                    {secondaryAction.label}
                  </Button>
                )}

                {primaryAction && (
                  <Button onClick={primaryAction.onClick}>
                    {primaryAction.label}
                  </Button>
                )}
              </div>
            )}
          </div>

          {illustrationSrc && (
            <div className="hidden lg:flex justify-end h-full">
              <Image
                src={illustrationSrc}
                alt="Dashboard illustration"
                priority
                width={300}
                height={100}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
