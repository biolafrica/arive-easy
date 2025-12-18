'use client';

import { useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Select } from './Select';
import { Divider } from './Divider';
import {
  STATES,
  PROPERTY_TYPES,
  PRICE_RANGES,
} from '@/data/propertyFilters';

interface PropertySearchFiltersProps {
  state?: string;
  city?: string;
  propertyType?: string;
  priceRange?: string;

  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onPropertyTypeChange: (value: string) => void;
  onPriceRangeChange: (value: string) => void;

  onSearch: () => void;

  showDividers?: boolean;
}

export function PropertySearchFilters({
  state,
  city,
  propertyType,
  priceRange,
  onStateChange,
  onCityChange,
  onPropertyTypeChange,
  onPriceRangeChange,
  onSearch,
  showDividers = true,
}: PropertySearchFiltersProps) {
  const cities = useMemo(() => {
    if (!state) return [];
    return STATES[state as keyof typeof STATES];
  }, [state]);

  return (
    <div className="flex flex-col gap-3 rounded-2xl rounded-tl-none lg:border lg:border-border bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:gap-0">
      <Select
        label="State"
        placeholder="Select Your State"
        value={state}
        options={Object.keys(STATES)}
        onChange={(value) => {
          onStateChange(value);
          onCityChange('');
        }}
      />

      {showDividers && <Divider />}

      <Select
        label="City"
        placeholder="Select Your City"
        value={city}
        options={cities}
        disabled={!state}
        onChange={onCityChange}
      />

      {showDividers && <Divider />}

      <Select
        label="Property Type"
        placeholder="Choose Property Type"
        value={propertyType}
        options={PROPERTY_TYPES}
        onChange={onPropertyTypeChange}
      />

      {showDividers && <Divider />}

      <Select
        label="Price Range"
        placeholder="Choose Price Range"
        value={priceRange}
        options={PRICE_RANGES}
        onChange={onPriceRangeChange}
      />

      {/* Search Button */}
      <button
        onClick={onSearch}
        className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-btn-secondary text-white transition hover:bg-primary/90 lg:mt-0 lg:ml-3 lg:w-12"
        aria-label="Search properties"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
