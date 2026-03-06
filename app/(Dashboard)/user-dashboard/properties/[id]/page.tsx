import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import UserDashbaordPropertyClientView from "@/components/sections/dashboard/property/user/PropertyClientView";

export const metadata = createMetadata({
  title: "User Dashboard - Property Detail",
  description: "Find your perfect home in Nigeria...",
});

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