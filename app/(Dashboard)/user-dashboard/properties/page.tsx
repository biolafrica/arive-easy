import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import PropertiesClientView from "@/components/sections/dashboard/property/user/PropertiesClientView";


export const metadata = createMetadata({
  title: "User Dashboard - Properties",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/user-dashboard/properties",
});


export default function UserDashboardProperties (){
  return(
    <PageContainer>
      <PropertiesClientView/>
    </PageContainer>
  )
}