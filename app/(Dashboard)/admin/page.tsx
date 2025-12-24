
import { PagePlaceholder } from '@/components/common/Placeholder';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function AdminDashboardPage() {
  return (
    <PagePlaceholder
      title="Admin Dashboard"
      description="This section is under construction. Admin tools and analytics will appear here."
      icon={<Cog6ToothIcon className="h-7 w-7 text-accent" />}
    />
  );
}
