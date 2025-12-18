'use client';

import { useState } from 'react';

export type PropertyStatus = string;

export interface PropertySearchFiltersState {
  status: PropertyStatus;
  state?: string;
  city?: string;
  propertyType?: string;
  priceRange?: string;
}

export function usePropertySearchFilters() {
  const [filters, setFilters] = useState<PropertySearchFiltersState>({
    status: 'Available',
  });

  return {
    filters,

    setStatus: (status: PropertyStatus) =>
      setFilters((f) => ({ ...f, status })),

    setState: (state?: string) =>
      setFilters((f) => ({
        ...f,
        state,
        city: undefined, // reset dependent
      })),

    setCity: (city?: string) =>
      setFilters((f) => ({ ...f, city })),

    setPropertyType: (propertyType?: string) =>
      setFilters((f) => ({ ...f, propertyType })),

    setPriceRange: (priceRange?: string) =>
      setFilters((f) => ({ ...f, priceRange })),

    submit: () => {
      // This is what you send to the backend
      console.log('SUBMIT FILTERS:', filters);

      // Example later:
      // fetchProperties(filters)
      // router.push(`/properties?${toSearchParams(filters)}`)
    },
  };
}
