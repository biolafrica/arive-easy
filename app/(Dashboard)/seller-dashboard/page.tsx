import { createMetadata } from '@/components/common/metaData';
import { PageContainer } from '@/components/layouts/dashboard/PageContainer';
import SellerHomeClientView from '@/components/sections/dashboard/home/SellerHomeClientView';


export const metadata = createMetadata({
  title: "Seller Dashboard - Home",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/seller-dashboard/",
});

export default function SellerDashboardPage() {
  return (
    <PageContainer className='space-y-5'>
      <SellerHomeClientView/>
    </PageContainer>

  );
}
