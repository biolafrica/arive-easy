import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import AdminTransactionClientView from "@/components/sections/dashboard/transaction/admin/AdminTransactionClientView";


export const metadata = createMetadata({
  title: "Admin Dashboard - Transactions",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/admin-dashboard/transactions",
});

export default function AdminDashboardTransactions (){
  return(
    <PageContainer>
      <AdminTransactionClientView />
    </PageContainer>
    
  )
}