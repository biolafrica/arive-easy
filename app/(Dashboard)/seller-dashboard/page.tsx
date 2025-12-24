
import { PagePlaceholder } from '@/components/common/Placeholder';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';

export default function SellerDashboardPage() {
  return (
    <PagePlaceholder
      title="Seller Dashboard"
      description="Your seller dashboard is being prepared. Property listings and buyer requests will appear here."
      icon={<BuildingOffice2Icon className="h-7 w-7 text-accent" />}
    />
  );
}
