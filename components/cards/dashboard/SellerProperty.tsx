"use client";

import { PropertyActions, StatusBadge, resolvePropertyStatus } from '@/components/sections/dashboard/listing/PropertyCardUtils';
import { formatUSD, toNumber } from '@/lib/formatter';
import { PropertyBase } from '@/type/pages/property';
import { EyeIcon, TagIcon,} from '@heroicons/react/24/outline';
import Image from 'next/image';


interface PropertyListingCardProps {
  property: PropertyBase;
  onEdit: (property: PropertyBase) => void;
}

export function PropertyListingCard({ property, onEdit}: PropertyListingCardProps) {
  const displayStatus = resolvePropertyStatus(property.status);

  return (
    <div className="flex flex-col md:flex-row overflow-hidden rounded-xl border bg-white">
      
      <div className="relative w-full md:w-[220px] aspect-[4/3] md:aspect-auto md:h-auto bg-gray-100">
        
  
        <div className="absolute right-2 top-4 z-10 md:hidden border rounded-full bg-white">
          <PropertyActions property={property} onEdit={onEdit} />
        </div>

        <Image
          src={property.images?.[0] || '/placeholder-property.jpg'}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 220px"
          className="object-cover"
          quality={85}
        />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-4">

        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-heading line-clamp-2">
            {property.title}
          </h3>

          <div className="hidden md:block">
            <PropertyActions property={property} onEdit={onEdit} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-secondary">

          <div className="flex items-center gap-2">
            <TagIcon className="h-5 w-5" />
            <span>{property.offers || 0} Offers</span>
          </div>

          <div className="flex items-center gap-2">
            <EyeIcon className="h-5 w-5" />
            <span>{property.views || 0} Views</span>
          </div>
        </div>

        <div className="text-xl md:text-2xl font-bold">
          {formatUSD({ amount: toNumber(property.price), fromCents: false, decimals: 0, })}
        </div>

        <div>
          <StatusBadge {...displayStatus} />
        </div>

      </div>
    </div>
  );
}

