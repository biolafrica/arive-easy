import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import UserHomeClientView from "@/components/sections/dashboard/home/user/UserHomeClientView";

export const metadata = createMetadata({
  title: "User Dashboard - Home",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/user-dashboard/",
});


export default function UserDashboardPage() {
  return (
    <PageContainer>
      <UserHomeClientView/>
    </PageContainer>
  );
}