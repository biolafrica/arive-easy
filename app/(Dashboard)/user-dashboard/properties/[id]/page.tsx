import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import UserDashbaordPropertyClientView from "@/components/sections/dashboard/property/user/PropertyClientView";

export default async  function UserDashbaordPropertyDetailPage(
  { params }: { params: Promise<{ id: string }> } 
) {
  const {id} =  await params;
  return(
    <PageContainer>
      <UserDashbaordPropertyClientView  id={id}/>
    </PageContainer>
  )
}