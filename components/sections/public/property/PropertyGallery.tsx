'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PropertyTourCard } from './PropertyTourCard';

interface PropertyGalleryProps {
  images: string[];
  virtualTourUrl?: string;
  videoTourUrl?: string;
}

export function PropertyGallery({
  images,
  virtualTourUrl,
  videoTourUrl,
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
      {(virtualTourUrl || videoTourUrl) && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {virtualTourUrl && (
            <PropertyTourCard
              title="3D Virtual Tour"
              coverImage={coverImage}
              buttonLabel="Start Virtual Tour"
              url={virtualTourUrl}
              type="3d"
            />
          )}

          {videoTourUrl && (
            <PropertyTourCard
              title="Video Tour"
              coverImage={coverImage}
              buttonLabel="Start Video"
              url={videoTourUrl}
              type="video"
            />
          )}
        </div>
      )}
    </div>
  );
}

