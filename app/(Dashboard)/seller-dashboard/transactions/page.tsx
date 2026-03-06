import { SellerTransactionStats } from "@/components/cards/dashboard/SellerTransaction";
import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import SellerTransactionClientView from "@/components/sections/dashboard/transaction/seller/SellerTransactionClientView";

export const metadata = createMetadata({
  title: "Seller Dashboard - Transactions",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/seller-dashboard/transactions",
});

export default function SellerDashboardTransaction (){
  return(
    <PageContainer className="space-y-5">
      <SellerTransactionStats/>
      <SellerTransactionClientView/> 
    </PageContainer>
  )
}