"use client"

import { useFeaturedProperties, useInfiniteProperties, useProperties } from "@/hooks/useSpecialized";

export default function Test(){
  const {
    items: properties,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    loadMoreRef,
    error,
  } = useInfiniteProperties({
    search:"emerald-height",
    sortBy: 'price',
    sortOrder: 'desc',
  });

  const { data: featuredProperties, isLoading: loadingFeatured } = useFeaturedProperties();

  if (isLoading) return <div>Loading properties...</div>;
  if (error) return <div>Error loading properties</div>;
  console.log("property:", properties)
  console.log("next page fetching", isFetchingNextPage)
  console.log("next page status", hasNextPage)
  console.log('featured properties', featuredProperties)

  return(
    <div>
      <h4>Test page</h4>
    </div>
  )
}