'use client'
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import { PreApprovalWelcome } from "@/components/sections/dashboard/approval/PreApprovalWelcome";
import { useRouter } from "next/navigation";

export default function UserApprovalHomePage(){
  const router = useRouter()
  return(
    <PageContainer>
      <PreApprovalWelcome onStart={()=>router.push("/user-dashboard/approval/personal-info")} />
    </PageContainer>
  )
}