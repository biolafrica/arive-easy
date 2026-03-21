import ErrorState from "@/components/feedbacks/ErrorState";
import SummaryTable from "@/components/table/SummaryTable";
import { MPstatusConfig, mortgagePayColumns } from "@/data/pages/dashboard/home";
import { useMonthlyMortgagePayments } from "@/hooks/useSpecialized/useMortgagePayment"

export default function AdminHomeMortgagePayment(){
  const { data: payments, isLoading, error, refetch } = useMonthlyMortgagePayments()

  if (error) {
    return (
      <ErrorState
        message="Error loading mortgage payment"
        retryLabel="Reload payments"
        onRetry={refetch}
      />
    );
  }


  return(
    <div>
      <SummaryTable
        title="Mortgage Payment for this Month" 
        columns={mortgagePayColumns}
        data={payments ?? []}
        loading={isLoading}
        emptyMessage={{ title: 'No Payment for this month', message: 'Mortgage Payment will appear here' }}
        statusConfig={MPstatusConfig}
        getStatus={(row) => row.status}
        showActions={false}
      />
    </div>
  )
}