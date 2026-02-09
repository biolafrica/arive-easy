'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/primitives/Button';

type BackButtonProps = {
  label?: string;
  fallbackHref?: string;
  className?: string;
};

export function BackButton({
  label = 'Back',
  fallbackHref,
  className = '',
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (fallbackHref && window.history.length <= 1) {
      router.push(fallbackHref);
      return;
    }
    router.back();
  };

  return (
    <Button
      variant="text"
      size="sm"
      leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
      className={`w-fit px-0 text-secondary ${className}`}
      onClick={handleBack}
    >
      {label}
    </Button>
  );
}
