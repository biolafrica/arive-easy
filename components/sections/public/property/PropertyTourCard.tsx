'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/primitives/Button';
import { CubeIcon, PlayIcon } from '@heroicons/react/24/outline';
import { PropertyTourCardProps } from '@/type/pages/property';
import { VideoModal } from './VideoModal';

export function PropertyTourCard({
  images,
  tours,
  video
}: PropertyTourCardProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  const Icon = video ? PlayIcon : CubeIcon;
  const title = video ? "Video Tour" : "3D Virtual Tour";
  const coverImage = images[0];
  const url = video ? tours?.video?.url : tours?.virtual3D?.url;
  const buttonLabel = video ? "Play Video" : "Start Virtual Tour";

  const handleClick = () => {
    if (video && tours?.video?.url) {
      setIsVideoModalOpen(true);
    } else if (!video && tours?.virtual3D?.url) {
      window.open(tours.virtual3D.url, '_blank');
    }
  };

  return (
    <>
      <div className="rounded-xl border border-border p-4 space-y-4">
        <h3 className="text-lg font-semibold text-heading">
          {title}
        </h3>

        <div 
          className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted cursor-pointer group"
          onClick={handleClick}
        >
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover:bg-black/40">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
              <Icon className="h-7 w-7 text-gray-800" />
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          fullWidth
          onClick={handleClick}
        >
          {buttonLabel}
        </Button>
      </div>

      {video && tours?.video?.url && (
        <VideoModal
          videoUrl={tours.video.url}
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          title="Property Video Tour"
        />
      )}
    </>
  );
}