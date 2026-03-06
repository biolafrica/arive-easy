import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import DocumentClientView from "@/components/sections/dashboard/documents/admin/DocumentClientView";


export const metadata = createMetadata({
  title: "Admin Dashboard - Documents",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/admin-dashboard/documents",
});

export default function AdminDashboardDocuments (){
  return(
    <PageContainer>
      <DocumentClientView />
    </PageContainer>
  )
}