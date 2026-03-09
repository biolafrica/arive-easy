import ErrorState from "@/components/feedbacks/ErrorState"
import SummaryTable from "@/components/table/SummaryTable"
import { columns, statusConfig } from "@/data/pages/dashboard/mortgage"
import { useMortgagePayments } from "@/hooks/useSpecialized/useMortgagePayment"

export default function MortgagePaymentSummaryTable({id, setActiveTab}: {
  id: string
  setActiveTab: () => void
}) {

  const {mortgagePayments, isLoading, error, refresh} = useMortgagePayments({
    filters: {
      mortgage_id:id,
    }
  })

  if (error) {
    return (
      <ErrorState
        message="Error loading mortgage payment tables"
        retryLabel="Reload mortgage payments"
        onRetry={refresh}
      />
    );
  }

  return(
    <div>
      <SummaryTable
        title="Recent Payments"
        onViewAll={setActiveTab}
        viewAllLabel="View all" 
        columns={columns}
        data={mortgagePayments.slice(0, 5)}
        loading={isLoading}
        emptyMessage={{ title: 'No mortgage payment', message: 'None yet' }}
        statusConfig={statusConfig}
        getStatus={(row) => row.status}
        showActions={false}
      />

    </div>
  )
} 