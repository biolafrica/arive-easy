import { HowItWorksStep } from '@/type/howItWorks';
import { MinusCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import React from 'react';

interface Props {
  step: HowItWorksStep;
  index: number;
}

export const HowItWorksStepCard: React.FC<Props> = ({ step }) => {
  return (
    <div className="relative flex flex-col items-center text-center px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-hover text-accent">
        <Image
          src={step.icon}
          alt={step.title}
          className="object-contain"
        />
       
      </div>

      <div className="mt-6 flex items-center gap-1">
        <span className="border-2 min-w-32 sm:min-w-40 lg:min-w-36 border-gray-400 rounded-sm" />
         <MinusCircleIcon className='text-orange-600 w-4 h-4'/>
        <span className="border-2 min-w-32 sm:min-w-40  lg:min-w-40 border-gray-400 rounded-sm " />
       
      </div>

      <h3 className="mt-4 text-lg font-semibold text-heading">
        {step.title}
      </h3>
      <p className="mt-2 text-sm text-secondary max-w-xs">
        {step.description}
      </p>
    </div>
  );
};
