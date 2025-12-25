import { EmptyState } from '@/components/feedbacks/Empty';
import { RectangleStackIcon } from '@heroicons/react/24/outline';

interface PropertyEmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export function PropertyEmptyState({
  hasFilters,
  onClearFilters,
}: PropertyEmptyStateProps) {
  if (hasFilters) {
    return (
      <EmptyState
        icon={<RectangleStackIcon className="h-24 w-24" />}
        title="No properties found"
        description="We couldn't find any properties matching your current filters."
        actions={[
          {
            label: 'Clear filters',
            onClick: onClearFilters!,
          },
          {
            label: 'Go back',
            variant: 'ghost',
            onClick: () => window.history.back(),
          },
        ]}
      />
    );
  }

  return (
    <EmptyState
      icon={<RectangleStackIcon className="h-24 w-24" />}
      title="No properties available"
      description="Check back soon for new listings!"
    />
  );
}


