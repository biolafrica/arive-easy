'use client'
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import { useRouter } from "next/navigation";

export default function UserApprovalHomePage(){
  const router = useRouter()
  return(
    <PageContainer>
      <h4>Hello</h4>
    </PageContainer>
  )
}