import React from 'react';
import Image from 'next/image';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { SectionHeading } from '@/components/common/SectionHeading';

interface Props {
  title?: string;
  description?: string;
  features: string[];
  image: string;
}

export const WhyChooseUs: React.FC<Props> = ({
  title = 'Why you should choose Arive',
  description =
    'Arive makes owning a home in Nigeria simple, secure, and within reach — no matter where you live.',
  features,
  image,
}) => {
  return (
    <section className="py-44 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          
          <SectionHeading
            title={title}
            description={description}
            align="left"
            size="sm"
          />

          <ul className="mt-8 space-y-4 text-base">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircleIcon className="h-6 w-6 text-blue-600 shrink-0" />
                <span className="text-text">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <Image
            src={image}
            alt="Why choose Arive"
            width={600}
            height={600}
            className="rounded-xl object-cover"
          />
        </div>

      </div>
    </section>
  );
};
