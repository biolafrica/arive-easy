import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import UserClientView from "@/components/sections/dashboard/users/UserClientView";

export default function AdminDashboardUsers (){
  return(
    <PageContainer>
      <UserClientView/>
    </PageContainer>
  )
}