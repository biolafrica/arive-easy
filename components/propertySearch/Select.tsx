'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

type SelectOption = string | { label: string; value: string; disabled?: boolean };

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
  const containerRef = useRef<HTMLDivElement>(null);


  const normalized = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt, disabled:false } : opt
  );

  const selected = normalized.find((o) => o.value === value && !o.disabled);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <div className="flex flex-1 flex-col gap-1 px-1 lg:px-4" ref={containerRef}>
      <span className="text-sm font-medium text-heading text-left">
        {label}
      </span>

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md bg-transparent text-sm transition',
            'text-heading focus:outline-none',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <span className={cn('truncate', !selected ? 'text-secondary' : 'text-heading font-semibold')}>
            {selected?.label || placeholder}
          </span>

          <ChevronDownIcon
            className={cn(
              'h-4 w-4 shrink-0 transition-transform pointer-events-none', open && 'rotate-180'
            )}
          />
        </button>

        {open && !disabled && (
          <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-white shadow-lg text-black overflow-hidden">
            {normalized.map((opt) => {
              const active = opt.value === value && !opt.disabled;

              return (
                <button
                  key={opt.value || opt.label}
                  disabled={opt.disabled}
                  onClick={() => {
                    if(opt.disabled) return;
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between px-4 py-3 text-sm transition',

                    opt.disabled && 'cursor-default text-secondary/50 pointer-events-none',

                    !opt.disabled && !active && 'text-secondary hover:bg-hover',

                    active && 'bg-primary/8 text-primary font-semibold border-l-2 border-primary'
                  )}
                >
                  {opt.label}
                  {active && <CheckIcon className="h-4 w-4 text-primary shrink-0" />}
                </button> 
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
