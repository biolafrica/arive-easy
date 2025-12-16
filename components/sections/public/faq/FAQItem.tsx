'use client';

import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { FAQItem as FAQItemType } from '@/type/faq';

interface Props {
  item: FAQItemType;
}

export function FAQItem({ item }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border py-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-medium text-heading">
          {item.question}
        </span>
        <ChevronUpIcon
          className={`h-5 w-5 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <p className="mt-3 text-sm text-secondary leading-relaxed">
          {item.answer}
        </p>
      )}
    </div>
  );
}
