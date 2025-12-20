'use client'

import { PropertyCard } from "@/components/cards/public/property";
import { Button } from "@/components/primitives/Button";
import { PropertySearchWrapper } from "@/components/propertySearch/PropertySearchWraper";
import { AllPropertyGridSkeleton } from "@/components/skeleton/PropertyCardSkeleton";
import { useInfiniteProperties } from "@/hooks/useSpecialized";

export default function AllProperties(){
    const {
    items: properties,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    loadMoreRef,
    error,
  } = useInfiniteProperties({
    sortBy: 'price',
    sortOrder: 'desc',
  });

  if (error) return <div>Error loading properties</div>;
  console.log("next page fetching", isFetchingNextPage)
  console.log("next page status", hasNextPage)

  return(
    <div>

      <div className="mt-10">
        <PropertySearchWrapper/>
      </div>

      {isLoading && <AllPropertyGridSkeleton/>}

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      <div className="mt-14 flex justify-center">
        <Button variant="outline">View more</Button>
      </div>
      
    </div>
  )
}