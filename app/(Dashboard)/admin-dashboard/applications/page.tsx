import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import AdminApplicationClientView from "@/components/sections/dashboard/application/admin/AdminApplicationsClientView";

export default function AdminDashboardApplication (){
  return(
    <PageContainer>
      <AdminApplicationClientView />
    </PageContainer>
  )
}