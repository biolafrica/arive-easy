'use client'

import { PropertyCard } from "@/components/cards/public/property";
import { PropertySearchWrapper } from "@/components/propertySearch/PropertySearchWraper";
import { useInfiniteProperties } from "@/hooks/useSpecialized";
import { PropertyEmptyState } from "./PropertyEmptyState";
import { useEffect, useState } from "react";
import { ProcessedFilters } from "@/hooks/usePropertySearchFilter";
import ErrorState from "@/components/feedbacks/ErrorState";
import { PropertyGrid } from "@/components/common/PropertyGrid";
import { useSearchParams } from "next/navigation";

const PRICE_RANGES: Record<string, { min?: number; max?: number }> = {
  '20-50':    { min: 20_000_000,  max: 50_000_000  },
  '50-100':   { min: 50_000_000,  max: 100_000_000 },
  '100-300k': { min: 100_000_000, max: 300_000_000 },
  '300+':     { min: 300_000_000                   },
};

function paramsToProcessedFilters(params: URLSearchParams): ProcessedFilters {
  const processed: ProcessedFilters = {};

  const status       = params.get('status') || 'active';
  const state        = params.get('state');
  const city         = params.get('city');
  const propertyType = params.get('propertyType');
  const priceRange   = params.get('priceRange');

  if (status)       processed.status        = status;
  if (state)        processed.state         = state;
  if (city)         processed.city          = city;
  if (propertyType) processed.property_type = propertyType;

  if (priceRange && PRICE_RANGES[priceRange]) {
    const range = PRICE_RANGES[priceRange];
    if (range.min !== undefined) processed['price.gte'] = range.min;
    if (range.max !== undefined) processed['price.lte'] = range.max;
  }

  return processed;
}

export default function AllProperties(){
  const searchParams = useSearchParams();

  const [appliedFilters, setAppliedFilters] = useState<ProcessedFilters>(() => 
    paramsToProcessedFilters(searchParams)
  );

  useEffect(() => {
    setAppliedFilters(paramsToProcessedFilters(searchParams))
  }, [searchParams]);

  const {
    items: properties, 
    isLoading, 
    isFetchingNextPage, 
    hasNextPage, 
    fetchNextPage, 
    error, 
    refresh 
  } = useInfiniteProperties({
    filters: {...appliedFilters},
    sortBy: 'price',
    sortOrder: 'desc',
  
  });

  const handleFiltersApply = (newFilters: ProcessedFilters) => {
    setAppliedFilters(newFilters);
  };

  const getActiveFilterCount = () => {
    return Object.entries(appliedFilters).filter(
      ([key, value]) => value !== undefined && value !='' && key !== 'status'
    ).length;
  };

  if (error) {
    return (
      <ErrorState
        message="Error loading properties"
        retryLabel="Reload data"
        onRetry={refresh}
      />
    );
  }

  return(
    <div>

      <div className="mt-10">
        <PropertySearchWrapper onFiltersApply={handleFiltersApply}/>
      </div>

      {getActiveFilterCount() > 0 && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <span>
            {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} applied
          </span>
          <button
            onClick={() => {
              setAppliedFilters({ status: 'active' });
              refresh();
            }}
            className="text-blue-600 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      <PropertyGrid
        items={properties}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        error={error}
        onRetry={refresh}
        emptyState={
          <PropertyEmptyState
            hasFilters={getActiveFilterCount() > 0}
            onClearFilters={() => {
              setAppliedFilters({ status: "active" });
              refresh();
            }}
          />
        }
        renderItem={(property) => (
          <PropertyCard key={property.id} property={property} />
        )}
      />

    </div>
  )
}