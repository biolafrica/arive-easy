import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import { PreApprovalSuccess } from "@/components/sections/dashboard/approval/PreApprovalSuccess";

export const metadata = createMetadata({
  title: "User Dashboard - Pre-Approval Success",
  description: "Find your perfect home in Nigeria...",
});

export default async function UserApprovalSuccessPage(
  { params }: { params: Promise<{ id: string }> } 
){
  const {id} = await params

  return(
    <PageContainer>
      <PreApprovalSuccess id={id}/>
    </PageContainer>
  )
}