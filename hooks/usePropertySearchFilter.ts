'use client';

import { useState, useCallback, useMemo } from 'react';

export type PropertyStatus = 'active' | 'sold' | 'offers';

export interface PropertySearchFiltersState {
  status: PropertyStatus;
  state?: string;
  city?: string;
  propertyType?: string;
  priceRange?: string;
}

export interface ProcessedFilters {
  status?: string;
  state?: string;
  city?: string;
  property_type?: string;
  'price.gte'?: number;
  'price.lte'?: number;
}

const PRICE_RANGES: Record<string, { min?: number; max?: number }> = {
  '20-50': { min: 20_000_000, max: 50_000_000 },
  '50-100': { min: 50_000_000, max: 100_000_000 },
  '100-300k': { min: 100_000_000, max: 300_000_000 },
  '300+': { min: 300_000_000 },
};

export function usePropertySearchFilters(
  onFiltersChange?: (filters: ProcessedFilters) => void,
  initialFilters?: Partial<PropertySearchFiltersState>

) {

  const [filters, setFilters] = useState<PropertySearchFiltersState>({
    status: 'active',
    ...initialFilters,
  });


 
  const processedFilters = useMemo((): ProcessedFilters => {
    const processed: ProcessedFilters = {};

    if (filters.status) processed.status = filters.status;
    if (filters.state) processed.state = filters.state;
    if (filters.city) processed.city = filters.city;
    if (filters.propertyType) processed.property_type = filters.propertyType;
    

    if (filters.priceRange && PRICE_RANGES[filters.priceRange]) {
      const range = PRICE_RANGES[filters.priceRange];
      if (range.min !== undefined) processed['price.gte'] = range.min;
      if (range.max !== undefined) processed['price.lte'] = range.max;
    }

    return processed;
  }, [filters]);

  const notifyChange = useCallback(() => {
    if (onFiltersChange) onFiltersChange(processedFilters);
  }, [processedFilters, onFiltersChange]);

  return {
    filters,
    processedFilters,
    setStatus: (status: PropertyStatus) => setFilters((f) => ({ ...f, status })),
    setState: (state?: string) => setFilters((f) => ({...f, state, city: undefined })),
    setCity: (city?: string) => setFilters((f) => ({ ...f, city })),
    setPropertyType: (propertyType?: string) => setFilters((f) => ({ ...f, propertyType })),
    setPriceRange: (priceRange?: string) => setFilters((f) => ({ ...f, priceRange })),
    submit: () => notifyChange(),
    reset: () => setFilters({ status: 'active' }),
    hasActiveFilters: Object.keys(filters).length > 1 || filters.status !== 'active',
  };
}
