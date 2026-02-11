import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import DocumentClientView from "@/components/sections/dashboard/documents/admin/DocumentClientView";

export default function AdminDashboardDocuments (){
  return(
    <PageContainer>
      <DocumentClientView />
    </PageContainer>
  )
}