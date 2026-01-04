import { PaymentMortgageStats } from "@/components/cards/dashboard/UserTransaction";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import UserTransactionClientView from "@/components/sections/dashboard/transaction/UserTransactionClientView";

export default function UserDashboardPayment (){
  return(
    <PageContainer className="space-y-4">
      <PaymentMortgageStats/>
      <UserTransactionClientView/>

    </PageContainer>
  )
}