import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import UserHomeClientView from "@/components/sections/dashboard/home/UserHomeClientView";

export default function UserDashboardPage() {
  return (
    <PageContainer>
      <UserHomeClientView/>
    </PageContainer>
  );
}