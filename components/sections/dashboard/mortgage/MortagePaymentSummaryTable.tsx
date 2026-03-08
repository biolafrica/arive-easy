import SummaryTable from "@/components/table/SummaryTable"
import { columns, statusConfig } from "@/data/pages/dashboard/mortgage"
import { useMortgagePayments } from "@/hooks/useSpecialized/useMortgagePayment"

export default function MortgagePaymentSummaryTable({id, setActiveTab}: {
  id: string
  setActiveTab: () => void
}) {

  const {mortgagePayments, isLoading, error} = useMortgagePayments({
    filters: {
      mortgage_id:id,
    }
  })

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