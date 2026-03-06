import { PaymentMortgageStats } from "@/components/cards/dashboard/UserTransaction";
import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import UserTransactionClientView from "@/components/sections/dashboard/transaction/user/UserTransactionClientView";

export const metadata = createMetadata({
  title: "User Dashboard - Payments",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/user-dashboard/payments",
});


export default function UserDashboardPayment (){
  return(
    <PageContainer className="space-y-4">
      <PaymentMortgageStats/>
      <UserTransactionClientView/>

    </PageContainer>
  )
}