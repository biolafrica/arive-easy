'use client'

import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import { PreApprovalSuccess } from "@/components/sections/dashboard/approval/PreApprovalSuccess";
import { useRouter } from "next/navigation";

export default function UserApprovalSuccessPage(){
    const router = useRouter()
  return(
    <PageContainer>
      <PreApprovalSuccess onDashboard={()=>router.push("/user-dashboard/applications")}/>
    </PageContainer>
  )
}