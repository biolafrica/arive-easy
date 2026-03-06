import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import UserApplicationClientView from "@/components/sections/dashboard/application/user/UserApplicationClientView";

export const metadata = createMetadata({
  title: "User Dashboard - Applications",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/user-dashboard/applications",
});

export default function UserDashboardApplication() {
  return (
    <>
      <PageContainer>
       <UserApplicationClientView />
      </PageContainer>
    </>
  );
}