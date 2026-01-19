"use client";

import { PropertyActions, StatusBadge, resolvePropertyStatus } from '@/components/sections/dashboard/listing/PropertyCardUtils';
import { formatUSD, toNumber } from '@/lib/formatter';
import { PropertyBase } from '@/type/pages/property';


interface PropertyListingCardProps {
  property: PropertyBase;
  onEdit: (property: PropertyBase) => void;
}

export function PropertyListingCard({ property, onEdit }: PropertyListingCardProps) {
  const displayStatus = resolvePropertyStatus(property.status);

  return (
    <div className="flex overflow-hidden rounded-xl border bg-white">
      <img
        src={property.images?.[0] || '/placeholder-property.jpg'}
        alt={property.title || property.address_full}
        className="h-48 w-48 object-cover"
      />

      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-heading">
              {property.title}
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge {...displayStatus} />
            </div>
          </div>
          
  
          <PropertyActions
            property={property}
            onEdit={onEdit}
          />
        </div>

        <div className="mt-6 text-2xl font-bold">
          {formatUSD({ amount: toNumber(property.price), fromCents: false, decimals: 0 })}
        </div>
      </div>
    </div>
  );
}