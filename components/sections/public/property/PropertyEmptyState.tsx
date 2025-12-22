import { Button } from "@/components/primitives/Button";

interface PropertyEmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export function PropertyEmptyState({ hasFilters, onClearFilters }: PropertyEmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <svg
          className="w-24 h-24 text-gray-300 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No properties found
        </h3>
        <p className="text-gray-600 mb-6 max-w-md">
          We couldn't find any properties matching your current filters. 
          Try adjusting your search criteria or clearing filters.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
          <Button variant="ghost" onClick={() => window.history.back()}>
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <svg
        className="w-24 h-24 text-gray-300 mb-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No properties available
      </h3>
      <p className="text-gray-600 mb-6">
        Check back soon for new listings!
      </p>
    </div>
  );
}
