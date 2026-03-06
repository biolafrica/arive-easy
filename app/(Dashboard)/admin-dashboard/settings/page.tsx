import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";


export const metadata = createMetadata({
  title: "Admin Dashboard - Settings",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/admin-dashboard/settings",
});

export default function AdminDashboardSettings (){
  return(
    <PageContainer>
      <h4>Admin Dashboard Settings</h4>
    </PageContainer>
  )
}