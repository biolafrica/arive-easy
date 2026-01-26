'use client';

import { PropertyImageCarousel } from '@/components/common/PropertyImageCarousel';
import { formatNumber } from '@/lib/formatter';
import { PropertyBase, } from '@/type/pages/property';
import {  MapPinIcon, HomeIcon, Square2StackIcon, CheckCircleIcon} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

interface PropertySelectionCardProps {
  property: PropertyBase;
  isSelected: boolean;
  onSelect: (propertyId: string) => void;
  formatPrice?: (price: number | string) => string;
  disabled?: boolean;
}

export function PropertySelectionCard({ 
  property, 
  isSelected, 
  onSelect,
  formatPrice = (price) => `$${Number(price).toLocaleString()}`,
  disabled = false
}: PropertySelectionCardProps) {
  
  const handleCardClick = () => {
    if (disabled) return;
    onSelect(property.id);
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onSelect(property.id);
  };

  return (
    <div 
      onClick={handleCardClick}
      className={cn(
        "relative rounded-xl border-2 bg-card shadow-sm transition-all duration-200",
        disabled  ? "cursor-default" : "cursor-pointer hover:shadow-md",
        isSelected ? "border-orange-500 ring-2 ring-orange-500/20" : disabled 
        ? "border-border" : "border-border hover:border-orange-300"
      )}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 z-20">
          <CheckCircleSolid className="h-7 w-7 text-orange-500 drop-shadow-sm" />
        </div>
      )}

      <div className="relative">
        <PropertyImageCarousel images={property.images} />
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-heading line-clamp-1">
          {property.title}
        </h3>

        <div className="flex items-start gap-2 text-sm text-secondary">
          <MapPinIcon className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="line-clamp-1">
            {property.address_full || `${property.city}, ${property.state}`}
          </span>
        </div>

        <div className="text-xl font-bold text-heading">
          {formatPrice(property.price)}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-secondary">
            <Square2StackIcon className="h-4 w-4" />
            <span>{formatNumber(property.area_sqm)} sqm</span>
          </div>
          
          <div className="flex items-center gap-2 text-secondary">
            <HomeIcon className="h-4 w-4" />
            <span>{property.property_type}</span>
          </div>
          
          <div className="flex items-center gap-2 text-secondary">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14" />
              <path d="M3 11h18" />
              <path d="M7 11V5" />
            </svg>
            
            <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-secondary">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12h16a1 1 0 011 1v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a1 1 0 011-1z" />
              <path d="M6 12V5a2 2 0 012-2h1a2 2 0 012 2v7" />
            </svg>
            <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
          </div>
        </div>

        {property.interior && (
          <div className="text-xs text-secondary bg-muted px-2 py-1 rounded-md inline-block">
            {property.interior}
          </div>
        )}

        <button
          onClick={handleSelectClick}
          disabled={disabled}
          className={cn(
            "w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isSelected
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-muted text-heading hover:bg-orange-100 hover:text-orange-600 border border-border"
          )}
        >
          {isSelected ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircleIcon className="h-5 w-5" />
              Selected
            </span>
          ) : (
            'Select Property'
          )}
        </button>
      </div>
    </div>
  );
}