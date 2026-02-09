import ErrorState from "@/components/feedbacks/ErrorState";
import { Button } from "@/components/primitives/Button";
import { AllPropertyGridSkeleton } from "../skeleton/PropertyCardSkeleton";

type PropertyGridProps<T> = {
  items?: T[];
  isLoading: boolean;
  error?: unknown;
  onRetry?: () => void;

  renderItem: (item: T) => React.ReactNode;
  emptyState: React.ReactNode;

  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;

  errorMessage?: string;
  skeleton?: React.ReactNode;
};



export function PropertyGrid<T>({
  items,
  isLoading,
  error,
  onRetry,
  renderItem,
  emptyState,
  isFetchingNextPage = false,
  hasNextPage,
  fetchNextPage,
  errorMessage = "Error loading properties",
  skeleton,
}: PropertyGridProps<T>) {
  if (error && onRetry) {
    return (
      <ErrorState
        message={errorMessage}
        retryLabel="Reload data"
        onRetry={onRetry}
      />
    );
  }

  return (
    <div>
      {isLoading && (<AllPropertyGridSkeleton />)}

      {!isLoading && items?.length === 0 && emptyState}

      {items && items.length > 0 && (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(renderItem)}
        </div>
      )}

      {isFetchingNextPage && (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4" />
              <div className="bg-gray-200 h-4 w-3/4 rounded mb-2" />
              <div className="bg-gray-200 h-4 w-1/2 rounded" />
            </div>
          ))}
        </div>
      )}

      {hasNextPage && fetchNextPage && !isFetchingNextPage && (
        <div className="mt-14 flex justify-center">
          <Button variant="outline" onClick={fetchNextPage}>
            View more properties
          </Button>
        </div>
      )}
    </div>
  );
}


