import { PageContainer } from '@/components/layouts/dashboard/PageContainer';
import SellerHomeClientView from '@/components/sections/dashboard/home/SellerHomeClientView';


export default function SellerDashboardPage() {
  return (
    <PageContainer className='space-y-5'>
      <SellerHomeClientView/>
    </PageContainer>

  );
}
