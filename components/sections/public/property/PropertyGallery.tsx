'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PropertyTourCard } from './PropertyTourCard';
import { PropertyGalleryProps } from '@/type/pages/property';



export function PropertyGallery({
  images,
  tours,
}: PropertyGalleryProps) {
  const [active, setActive] = useState(0);
  const coverImage = images[0];

  return (
    <div className="space-y-6">
      {/* Main image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
        <Image
          src={images[active]}
          alt="Property image"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border ${
              active === i
                ? 'border-accent'
                : 'border-border'
            }`}
          >
            <Image
              src={img}
              alt=""
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Tours */}
      {(tours?.virtual3D || tours?.video) && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tours.virtual3D && (
            <PropertyTourCard
            images={images}
            tours={tours}
            video={false}
            />
          )}

          {tours.video && (
            <PropertyTourCard
            images={images}
            tours={tours}
            video={true}
            />
          )}
        </div>
      )}
    </div>
  );
}

