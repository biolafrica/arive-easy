import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import { PreApprovalSuccess } from "@/components/sections/dashboard/approval/PreApprovalSuccess";

export default async function UserApprovalSuccessPage({params}:{params:{id:string}}){
  const {id} = await params
  console.log('UserApprovalSuccessPage id:', id);
  return(
    <PageContainer>
      <PreApprovalSuccess id={id}/>
    </PageContainer>
  )
}