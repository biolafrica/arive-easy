import { SellerTransactionStats } from "@/components/cards/dashboard/SellerTransaction";
import SellerTransactionClientView from "@/components/sections/dashboard/transaction/SellerTransactionClientView";

export default function SellerDashboardTransaction (){
  return(
    <div className="space-y-5">
      <SellerTransactionStats/>
      <SellerTransactionClientView/> 
    </div>
  )
}