import { EmptyState } from '@/components/feedbacks/Empty';
import { HeartIcon, HomeIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export function NoActiveMortgageState() {
  const router = useRouter()
  return (
    <EmptyState
      icon={<HomeIcon className="h-24 w-24" />}
      title="No active mortgages yet"
      description="Once you purchase a property or your mortgage is approved, it will appear here."
      actions={[
        {
          label: 'Start Pre-Approval',
          onClick: () => {router.push('/user-dashboard/application/pre-approval')},
        },
      ]}
    />
  );
}

export function NoSavedPropertiesState({setTab}:any) {
  return (
    <EmptyState
      icon={<HeartIcon className="h-24 w-24" />}
      title="No saved properties"
      description="Save properties you're interested in so you can easily find them later."
      actions={[
        {
          label: 'Browse properties',
          onClick: () => {
            setTab('browse')
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


