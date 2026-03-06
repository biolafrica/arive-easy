import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import DocumentClientView from "@/components/sections/dashboard/documents/seller/DocumentClientView";


export const metadata = createMetadata({
  title: "Seller Dashboard - Documents",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/seller-dashboard/documents",
});

export default function SellerDashboardDocuments (){
  return(
    <PageContainer>
      <DocumentClientView/>
    </PageContainer>
  )
}
