
import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import { PreApprovalWelcome } from "@/components/sections/dashboard/approval/PreApprovalWelcome";

export const metadata = createMetadata({
  title: "User Dashboard - Pre-Approval",
  description: "Find your perfect home in Nigeria...",
});

export default async function UserApprovalHomePage(
  { params }: { params: Promise<{ id: string }> } 
){
  const {id} = await params
  return(
    <PageContainer>
      <PreApprovalWelcome id={id} />
    </PageContainer>
  )
}