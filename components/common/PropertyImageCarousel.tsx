'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  images: string[];
}

export function PropertyImageCarousel({ images }: Props) {
  const [index, setIndex] = useState(0);

  return (
    <div className="relative overflow-hidden rounded-t-xl">

      <div
        className="flex transition-transform duration-300"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="relative h-56 w-full shrink-0">
            <Image
              src={src}
              alt={`Property image ${i + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={cn(
              'h-1.5 w-1.5 rounded-full transition',
              index === i ? 'bg-white' : 'bg-white/50'
            )}
          />
        ))}
      </div>

    </div>
  );
}
