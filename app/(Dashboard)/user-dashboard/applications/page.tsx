import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import UserApplicationClientView from "@/components/sections/dashboard/application/UserApplicationClientView";

export default function UserDashboardApplication() {
  return (
    <>
      <PageContainer>
       <UserApplicationClientView />
      </PageContainer>
    </>
  );
}