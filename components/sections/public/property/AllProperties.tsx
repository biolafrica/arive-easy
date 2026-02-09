'use client'

import { PropertyCard } from "@/components/cards/public/property";
import { Button } from "@/components/primitives/Button";
import { PropertySearchWrapper } from "@/components/propertySearch/PropertySearchWraper";
import { AllPropertyGridSkeleton } from "@/components/skeleton/PropertyCardSkeleton";
import { useInfiniteProperties } from "@/hooks/useSpecialized";
import { PropertyEmptyState } from "./PropertyEmptyState";
import { useState } from "react";
import { ProcessedFilters } from "@/hooks/usePropertySearchFilter";
import ErrorState from "@/components/feedbacks/ErrorState";

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

      {isLoading && <AllPropertyGridSkeleton/>}

      {!isLoading && properties?.length === 0 && (
        <PropertyEmptyState
          hasFilters={getActiveFilterCount() > 0}
          onClearFilters={() => {
            setAppliedFilters({ status: 'Available' });
            refresh();
          }}
        />
      )}

      {properties && properties.length > 0 && (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {isFetchingNextPage && (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={`loading-${i}`} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {hasNextPage && !isFetchingNextPage && (
        <div className="mt-14 flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => fetchNextPage()} 
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading...' : 'View more properties'}
          </Button>
        </div>
      )}

    </div>
  )
}