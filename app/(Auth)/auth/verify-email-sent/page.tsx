'use client';

import { EnvelopeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/components/primitives/Button';

export default function VerifyEmailSent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-layout px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-hover">
          <EnvelopeIcon className="h-7 w-7 text-accent" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-heading">
          Check your email
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm text-secondary">
          We’ve sent a verification link to your email address.
        </p>
        <p className="mt-1 text-sm text-secondary">
          Click the link in the email to verify your account and continue.
        </p>

        {/* CTA */}
        <div className="mt-8">
          <Link href="/">
            <Button fullWidth>
              Back to homepage
            </Button>
          </Link>
        </div>

        {/* Helper text */}
        <p className="mt-4 text-xs text-secondary">
          Didn’t receive the email? Check your spam folder or try again.
        </p>
      </div>
    </div>
  );
}
