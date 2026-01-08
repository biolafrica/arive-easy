'use client';

import Image from 'next/image';
import { useState, useRef, TouchEvent, MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Props {
  images: string[];
}

export function PropertyImageCarousel({ images }: Props) {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const mouseStartX = useRef<number>(0);


  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && index < images.length - 1) {
      setIndex(index + 1);
    }
    if (isRightSwipe && index > 0) {
      setIndex(index - 1);
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    mouseStartX.current = e.clientX;
    e.preventDefault(); 
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const distance = mouseStartX.current - e.clientX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && index < images.length - 1) {
      setIndex(index + 1);
    }
    if (isRightSwipe && index > 0) {
      setIndex(index - 1);
    }

    setIsDragging(false);
    mouseStartX.current = 0;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    mouseStartX.current = 0;
  };

  const goToPrevious = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const goToNext = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (index < images.length - 1) {
      setIndex(index + 1);
    }
  };

  const handleDotClick = (e: MouseEvent, i: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex(i);
  };

  return (
    <div className="relative overflow-hidden rounded-t-xl group">
      <div
        className="flex transition-transform duration-300 ease-out select-none"
        style={{ 
          transform: `translateX(-${index * 100}%)`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {images.map((src, i) => (
          <div 
            key={i} 
            className="relative h-56 w-full shrink-0"
            draggable={false}
          >
            <Image
              src={src}
              alt={`Property image ${i + 1}`}
              fill
              className="object-cover pointer-events-none"
              draggable={false}
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full",
              "bg-black/50 backdrop-blur-sm text-white",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "hover:bg-black/70 hidden md:block",
              index === 0 && "hidden"
            )}
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={goToNext}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full",
              "bg-black/50 backdrop-blur-sm text-white",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "hover:bg-black/70 hidden md:block",
              index === images.length - 1 && "hidden"
            )}
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => handleDotClick(e, i)}
              className={cn(
                'transition-all duration-300',
                index === i 
                  ? 'h-1.5 w-5 bg-white rounded-full' 
                  : 'h-1.5 w-1.5 bg-white/60 hover:bg-white/80 rounded-full'
              )}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-white text-xs">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}
