
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/primitives/Button';
import { EmptyState } from '@/components/common/EmptyState';

interface PropertyEmptyStateProps {
  onResetFilters?: () => void;
}

export function PropertyEmptyState({
  onResetFilters,
}: PropertyEmptyStateProps) {
  return (
    <EmptyState
      icon={<MagnifyingGlassIcon className="h-6 w-6" />}
      title="No properties found"
      description="Try adjusting your filters or explore other locations."
      action={
        onResetFilters && (
          <Button variant="outline" onClick={onResetFilters}>
            Reset filters
          </Button>
        )
      }
    />
  );
}
