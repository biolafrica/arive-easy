import { createMetadata } from '@/components/common/metaData';
import { PageContainer } from '@/components/layouts/dashboard/PageContainer';
import AdminHomeClientView from '@/components/sections/dashboard/home/admin/AdminHomeClientView';


export const metadata = createMetadata({
  title: "Admin Dashboard - Overview",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/admin-dashboard/",
});

export default function AdminDashboardPage() {
  return (
    <PageContainer className='space-y-5'>
      <AdminHomeClientView/>
    </PageContainer>
  );
}
