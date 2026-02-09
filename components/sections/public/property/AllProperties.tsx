'use client'

import { PropertyCard } from "@/components/cards/public/property";
import { PropertySearchWrapper } from "@/components/propertySearch/PropertySearchWraper";
import { useInfiniteProperties } from "@/hooks/useSpecialized";
import { PropertyEmptyState } from "./PropertyEmptyState";
import { useState } from "react";
import { ProcessedFilters } from "@/hooks/usePropertySearchFilter";
import ErrorState from "@/components/feedbacks/ErrorState";
import { PropertyGrid } from "@/components/common/PropertyGrid";

export default function AllProperties(){
  const [appliedFilters, setAppliedFilters] = useState<ProcessedFilters>({
    status: 'active'
  });

  const {items: properties, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refresh } = useInfiniteProperties({
    filters: {...appliedFilters},
    sortBy: 'price',
    sortOrder: 'desc',
  
  });

  const handleFiltersApply = (newFilters: ProcessedFilters) => {
    console.log('Applying new filters:', newFilters);
    setAppliedFilters(newFilters);
  };

  const getActiveFilterCount = () => {
    return Object.entries(appliedFilters).filter(([key, value]) => 
      value !== undefined && key !== 'status'
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
          <span>{getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} applied</span>
          <button
            onClick={() => {
              setAppliedFilters({ status: 'Available' });
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
              setAppliedFilters({ status: "Available" });
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