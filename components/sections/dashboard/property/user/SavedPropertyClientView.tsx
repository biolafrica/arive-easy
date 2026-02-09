import { useInfiniteFavoriteProperties } from "@/hooks/useSpecialized"
import { NoSavedPropertiesState } from "./PropertyEmptyState"
import { AllPropertyGridSkeleton } from "@/components/skeleton/PropertyCardSkeleton"
import { PropertyCard } from "@/components/cards/public/property"
import { Button } from "@/components/primitives/Button"
import { useAuthContext } from "@/providers/auth-provider"
import ErrorState from "@/components/feedbacks/ErrorState"

export default function SavedPropertyClientView({setTab}:any){
  const { user } = useAuthContext();
  const {items:favorite, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refresh } = useInfiniteFavoriteProperties(
    {
      include: ['properties'],
      filters: {
        user_id :user?.id,
      }
    }
  )

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
      {isLoading && <AllPropertyGridSkeleton/>}

      {!isLoading && favorite.length === 0 && (
        <NoSavedPropertiesState setTab={setTab}/>
      )}

      {favorite && favorite.length > 0 && (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {favorite.map((property) => (
            <PropertyCard key={property.id} property={property.properties} interfaceType="buyer" />
          ))}
        </div>
      )}

      {isFetchingNextPage &&  (
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