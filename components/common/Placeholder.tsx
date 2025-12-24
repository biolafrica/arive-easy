'use client';

import Link from 'next/link';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/primitives/Button';

interface PagePlaceholderProps {
  title: string;
  description?: string;
  showHomeButton?: boolean;
  icon?: React.ReactNode;
}

export function PagePlaceholder({
  title,
  description,
  showHomeButton = true,
  icon,
}: PagePlaceholderProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-hover">
          {icon ?? <LockClosedIcon className="h-7 w-7 text-accent" />}
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-heading">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="mt-3 text-sm text-secondary">
            {description}
          </p>
        )}

        {/* CTA */}
        {showHomeButton && (
          <div className="mt-8">
            <Link href="/">
              <Button fullWidth>
                Back to homepage
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
