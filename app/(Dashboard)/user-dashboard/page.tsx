
import { PagePlaceholder } from '@/components/common/Placeholder';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';

export default function UserDashboardPage() {
  return (
    <PagePlaceholder
      title="User Dashboard"
      description="Your user dashboard is being prepared. Property listings and your properties will appear here."
      icon={<BuildingOffice2Icon className="h-7 w-7 text-accent" />}
    />
  );
}