import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import AdminApplicationClientView from "@/components/sections/dashboard/application/admin/AdminApplicationsClientView";

export const metadata = createMetadata({
  title: "Admin Dashboard - Applications",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/admin-dashboard/applications",
});

export default function AdminDashboardApplication (){
  return(
    <PageContainer>
      <AdminApplicationClientView />
    </PageContainer>
  )
}