import ErrorState from "@/components/feedbacks/ErrorState";
import SummaryTable from "@/components/table/SummaryTable";
import { columns, statusConfig } from "@/data/pages/dashboard/offer";
import { useAdminOffers } from "@/hooks/useSpecialized/useOffers";

export default function AdminHomeOffers(){
  const {items:offers, isLoading, error, refresh} = useAdminOffers({
    include: ['users'],
    filters:{
      status:'pending'
    },
    limit:5
  });

  if (error) {
    return (
      <ErrorState
        message="Error loading offer tables"
        retryLabel="Reload offers"
        onRetry={refresh}
      />
    );
  }

  return(
    <div>
      <SummaryTable
        title="Pending Offers Awaiting Response" 
        columns={columns}
        data={offers}
        loading={isLoading}
        emptyMessage={{ title: 'No Pending Offers', message: 'Pending Offers will appear' }}
        statusConfig={statusConfig}
        getStatus={(row) => row.status}
        showActions={false}
      />
    </div>
  )
}