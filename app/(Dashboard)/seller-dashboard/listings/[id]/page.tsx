import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import ListingClientView from "@/components/sections/dashboard/listing/ListingClientView";


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