
import { PagePlaceholder } from '@/components/common/Placeholder';
import { createMetadata } from '@/components/common/metaData';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';


export const metadata = createMetadata({
  title: "Admin Dashboard - Overview",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/admin-dashboard/",
});

export default function AdminDashboardPage() {
  return (
    <PagePlaceholder
      title="Admin Dashboard"
      description="This section is under construction. Admin tools and analytics will appear here."
      icon={<Cog6ToothIcon className="h-7 w-7 text-accent" />}
    />
  );
}
