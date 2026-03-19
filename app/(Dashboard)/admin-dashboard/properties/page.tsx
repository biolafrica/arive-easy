import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer"
import AdminPropertiesClientView from "@/components/sections/dashboard/property/admin/AdminPropertiesClientView";



export const metadata = createMetadata({
  title: "Admin Dashboard - Properties",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/admin-dashboard/properties",
});


export default function AdminDashboardProperties (){
  return(
    <PageContainer>
      <AdminPropertiesClientView/>
    </PageContainer>
  )
}