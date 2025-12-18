'use client';

import { useState } from 'react';
import {
  ChevronDownIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

type SelectOption = string | { label: string; value: string };

interface SelectProps {
  label: string;
  value?: string;
  placeholder: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function Select({
  label,
  value,
  placeholder,
  options,
  onChange,
  disabled,
}: SelectProps) {
  const [open, setOpen] = useState(false);

  const normalized = options.map((opt) =>
    typeof opt === 'string'
      ? { label: opt, value: opt }
      : opt
  );

  const selected = normalized.find((o) => o.value === value);

  return (
    <div className="flex flex-1 flex-col gap-1 px-1 lg:px-4">
      <span className="text-sm font-medium text-heading">
        {label}
      </span>

      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md bg-transparent pr-8 text-sm transition',
            'text-secondary focus:outline-none',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <span className={cn(!selected && 'text-muted')}>
            {selected?.label || placeholder}
          </span>

          <ChevronDownIcon
            className={cn(
              'h-4 w-4 transition-transform',
              open && 'rotate-180'
            )}
          />
        </button>

        {/* Dropdown */}
        {open && !disabled && (
          <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-white shadow-lg">
            {normalized.map((opt) => {
              const active = opt.value === value;

              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between px-4 py-3 text-sm transition',
                    'hover:bg-hover',
                    active && 'bg-accent/10 text-accent'
                  )}
                >
                  {opt.label}
                  {active && (
                    <CheckIcon className="h-4 w-4" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
