import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import ListingClientView from "@/components/sections/dashboard/listing/ListingClientView";

export const metadata = createMetadata({
  title: "Seller Dashboard - Listing Detail",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/seller-dashboard/listings/[id]",
});

export default async  function UserDashbaordPropertyDetailPage(
  { params }: { params: Promise<{ id: string }> } 
) {
  const {id} =  await params;
  return(
    <PageContainer>
      < ListingClientView id={id}/>
    </PageContainer>
  )
}