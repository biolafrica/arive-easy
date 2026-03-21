'use client';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface AccordionProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function Accordion({ title, subtitle, defaultOpen = false, children }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border p-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <div>
          <span className="font-medium text-heading">{title}</span>
          {subtitle && !open && <p className="text-sm text-secondary mt-0.5">{subtitle}</p>}
        </div>
        <ChevronUpIcon
          className={`h-5 w-5 flex-shrink-0 transition-transform text-[#F97316] ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}