import { SellerTransactionStats } from "@/components/cards/dashboard/SellerTransaction";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import SellerTransactionClientView from "@/components/sections/dashboard/transaction/SellerTransactionClientView";

export default function SellerDashboardTransaction (){
  return(
    <PageContainer className="space-y-5">
      <SellerTransactionStats/>
      <SellerTransactionClientView/> 
    </PageContainer>
  )
}