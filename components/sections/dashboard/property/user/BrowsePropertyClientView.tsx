'use client'

import { useInfiniteProperties } from "@/hooks/useSpecialized";
import { NoBrowseResultsState } from "./PropertyEmptyState";
import { PropertyCard } from "@/components/cards/public/property";
import { PropertyGrid } from "@/components/common/PropertyGrid";

export default function BrowsePropertyClientView() {
  const {
    items: properties,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refresh,
  } = useInfiniteProperties({
    sortBy: "price",
    sortOrder: "desc",
  });

  return (
    <PropertyGrid
      items={properties}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      error={error}
      onRetry={refresh}
      emptyState={<NoBrowseResultsState />}
      renderItem={(property) => (
        <PropertyCard
          key={property.id}
          property={property}
          interfaceType="buyer"
        />
      )}
    />
  );
}
