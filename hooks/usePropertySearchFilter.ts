'use client';

import { useState, useCallback, useMemo } from 'react';

export type PropertyStatus = 'Available' | 'Sold' | 'Pending';

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
  '20-50': { min: 20000000, max: 50000000 },
  '50-100': { min: 50000000, max: 100000000 },
  '100-300k': { min: 100000000, max: 300000000 },
  '300+': { min: 300000000 },
};

export function usePropertySearchFilters(onFiltersChange?: (filters: ProcessedFilters) => void) {
  const [filters, setFilters] = useState<PropertySearchFiltersState>({
    status: 'Available',
  });

 
  const processedFilters = useMemo((): ProcessedFilters => {
    const processed: ProcessedFilters = {};

    // Map status
    if (filters.status) {
      processed.status = filters.status;
    }

    // Map location filters
    if (filters.state) {
      processed.state = filters.state;
    }
    if (filters.city) {
      processed.city = filters.city;
    }

    // Map property type
    if (filters.propertyType) {
      processed.property_type = filters.propertyType;
    }

    // Map price range to min/max
    if (filters.priceRange && PRICE_RANGES[filters.priceRange]) {
      const range = PRICE_RANGES[filters.priceRange];
      if (range.min) processed['price.gte'] = range.min;
      if (range.max) processed['price.lte'] = range.max;
    }

    return processed;
  }, [filters]);

  // Notify parent component when filters change
  const notifyChange = useCallback(() => {
    if (onFiltersChange) {
      onFiltersChange(processedFilters);
    }
  }, [processedFilters, onFiltersChange]);

  return {
    filters,
    processedFilters,

    setStatus: (status: PropertyStatus) => {
      setFilters((f) => ({ ...f, status }));
    },

    setState: (state?: string) => {
      setFilters((f) => ({
        ...f,
        state,
        city: undefined, // Reset city when state changes
      }));
    },

    setCity: (city?: string) => {
      setFilters((f) => ({ ...f, city }));
    },

    setPropertyType: (propertyType?: string) => {
      setFilters((f) => ({ ...f, propertyType }));
    },

    setPriceRange: (priceRange?: string) => {
      setFilters((f) => ({ ...f, priceRange }));
    },

    submit: () => {
      console.log('Applying filters:', processedFilters);
      notifyChange();
    },

    reset: () => {
      setFilters({ status: 'Available' });
    },

    hasActiveFilters: Object.keys(filters).length > 1 || filters.status !== 'Available',
  };
}
