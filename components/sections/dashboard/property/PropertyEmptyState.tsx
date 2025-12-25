import { EmptyState } from '@/components/feedbacks/Empty';
import { HeartIcon, HomeIcon, RectangleStackIcon } from '@heroicons/react/24/outline';

export function NoActiveMortgageState() {
  return (
    <EmptyState
      icon={<HomeIcon className="h-24 w-24" />}
      title="No active mortgages yet"
      description="Once you purchase a property or your mortgage is approved, it will appear here."
    />
  );
}

export function NoSavedPropertiesState() {
  return (
    <EmptyState
      icon={<HeartIcon className="h-24 w-24" />}
      title="No saved properties"
      description="Save properties you're interested in so you can easily find them later."
      actions={[
        {
          label: 'Browse properties',
          onClick: () => {
            // router.push('/properties')
          },
        },
      ]}
    />
  );
}

export function NoBrowseResultsState() {
  return (
    <EmptyState
      icon={<RectangleStackIcon className="h-24 w-24" />}
      title="No properties match your search"
      description="Try adjusting your filters or exploring other locations."
    />
  );
}


