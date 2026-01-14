import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import AdminTransactionClientView from "@/components/sections/dashboard/transaction/admin/AdminTransactionClientView";

export default function AdminDashboardTransactions (){
  return(
    <PageContainer>
      <AdminTransactionClientView />
    </PageContainer>
    
  )
}