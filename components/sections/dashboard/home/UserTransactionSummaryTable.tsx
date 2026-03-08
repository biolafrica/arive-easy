import SummaryTable from "@/components/table/SummaryTable";
import { columns, statusConfig } from "@/data/pages/dashboard/transaction";
import {useTransactions } from "@/hooks/useSpecialized/useTransaction";
import { useRouter } from "next/navigation";

export default function UserTransactionSummaryTable() {
  const router = useRouter();

  const { transactions,isLoading } = useTransactions({
    include: ['applications'],
    limit: 5,
  });

  return(
    <div>
      <SummaryTable
        title="Recent Transactions" 
        onViewAll={() => router.push('/seller-dashboard/offers')}
        viewAllLabel="View all" 
        columns={columns}
        data={transactions}
        loading={isLoading}
        emptyMessage={{ title: 'No payment made yet', message: 'Transactions will appear here' }}
        statusConfig={statusConfig}
        getStatus={(row) => row.status}
        showActions={false}
      />
    </div>
  )
}