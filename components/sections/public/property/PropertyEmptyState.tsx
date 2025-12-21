
import { HomeModernIcon} from '@heroicons/react/24/solid';
import { EmptyState } from '@/components/common/EmptyState';

export function PropertyEmptyState() {
  return (
    <EmptyState
      icon={<HomeModernIcon className="h-6 w-6" />}
      title="No properties found"
      description="Try adjusting your filters or explore other locations."
    />
  );
}
