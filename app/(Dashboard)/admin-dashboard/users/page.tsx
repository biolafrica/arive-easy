import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import UserClientView from "@/components/sections/dashboard/users/UserClientView";


export const metadata = createMetadata({
  title: "Admin Dashboard - Users",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/admin-dashboard/users",
});

export default function AdminDashboardUsers (){
  return(
    <PageContainer>
      <UserClientView/>
    </PageContainer>
  )
}