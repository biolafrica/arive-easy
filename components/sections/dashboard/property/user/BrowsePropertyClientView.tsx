'use client'

import { AllPropertyGridSkeleton } from "@/components/skeleton/PropertyCardSkeleton";
import { useInfiniteProperties } from "@/hooks/useSpecialized";
import { NoBrowseResultsState } from "./PropertyEmptyState";
import { PropertyCard } from "@/components/cards/public/property";
import { Button } from "@/components/primitives/Button";

export default function BrowsePropertyClientView(){

  const {items: properties, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refresh } = useInfiniteProperties({
    sortBy: 'price',
    sortOrder: 'desc',
  });

  return(
    <div>
      
      {isLoading && <AllPropertyGridSkeleton/>}

      {!isLoading && properties?.length === 0 && (
        <NoBrowseResultsState/>
      )}

      {properties && properties.length > 0 && (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} interfaceType="buyer" />
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