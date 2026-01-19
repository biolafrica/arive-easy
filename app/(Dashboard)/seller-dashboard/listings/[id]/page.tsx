import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import ListingClientView from "@/components/sections/dashboard/listing/ListingClientView";


export default async  function UserDashbaordPropertyDetailPage({params}:any){
  const {id} = await params;

  return(
    <PageContainer>
      < ListingClientView id={id}/>
    </PageContainer>
  )
}