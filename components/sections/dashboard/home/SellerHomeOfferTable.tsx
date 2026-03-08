import SummaryTable from "@/components/table/SummaryTable";
import { columns, statusConfig } from "@/data/pages/dashboard/offer";
import { useSellerOffers } from "@/hooks/useSpecialized/useOffers";
import { useRouter } from "next/navigation";

export default function SellerHomeOfferTable({value=''}:{
  value:string
}) {
  const router = useRouter();

  const {offers, isLoading} = useSellerOffers({
    include: ['properties','users'],
  }, value);

  return(
    <div>
      <SummaryTable
        title="Recent Offers and Interests" 
        onViewAll={() => router.push('/seller-dashboard/offers')}
        viewAllLabel="View all" 
        columns={columns}
        data={offers.slice(0, 5)}
        loading={isLoading}
        emptyMessage={{ title: 'No offer yet', message: 'Offers will appear here' }}
        statusConfig={statusConfig}
        getStatus={(row) => row.status}
        showActions={false}
      />
    </div>
  )
}