
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import { PreApprovalWelcome } from "@/components/sections/dashboard/approval/PreApprovalWelcome";

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