'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PropertyTourCard } from './PropertyTourCard';
import { PropertyGalleryProps } from '@/type/pages/property';
import { ImageZoomModal } from './ImageZoomModal';
import { MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';

export function PropertyGallery({
  images,
  tours,
}: PropertyGalleryProps) {
  const [active, setActive] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const coverImage = images[0];

  const handleImageClick = () => {
    setIsZoomOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div 
          className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted cursor-zoom-in group"
          onClick={handleImageClick}
        >
          <Image
            src={images[active]}
            alt="Property image"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
          
          <div className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <MagnifyingGlassPlusIcon className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border transition-all ${
                active === i
                  ? 'border-accent ring-2 ring-accent/30'
                  : 'border-border hover:border-accent/50'
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

      <ImageZoomModal
        images={images}
        initialIndex={active}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
      />
    </>
  );
}

