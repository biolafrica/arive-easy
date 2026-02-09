'use client'

import { useInfiniteFavoriteProperties } from "@/hooks/useSpecialized";
import { useAuthContext } from "@/providers/auth-provider";
import { NoSavedPropertiesState } from "./PropertyEmptyState";
import { PropertyCard } from "@/components/cards/public/property";
import { PropertyGrid } from "@/components/common/PropertyGrid";

export default function SavedPropertyClientView({ setTab }: any) {
  const { user } = useAuthContext();

  const {
    items: favorite,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refresh,
  } = useInfiniteFavoriteProperties({
    include: ["properties"],
    filters: { user_id: user?.id },
  });

  return (
    <PropertyGrid
      items={favorite}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      error={error}
      onRetry={refresh}
      emptyState={<NoSavedPropertiesState setTab={setTab} />}
      renderItem={(fav) => (
        <PropertyCard
          key={fav.id}
          property={fav.properties}
          interfaceType="buyer"
        />
      )}
    />
  );
}
