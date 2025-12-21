import { EmptyState } from "@/components/common/EmptyState";
import { InboxIcon } from "@heroicons/react/24/solid";

export function ArticleEmptyState() {
  return (
    <EmptyState
      icon={<InboxIcon className="h-6 w-6" />}
      title="No properties found"
      description="Try adjusting your filters or explore other locations."
    />
  );
}