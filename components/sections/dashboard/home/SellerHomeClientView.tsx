'use client'

import { SellerDashboadStats } from "@/components/cards/dashboard/SellerDashboard";
import { DashboardWelcomeHeader } from "./DashboardWelcomeHeader";
import { useAuthContext } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useSidePanel } from "@/hooks/useSidePanel";
import { columns, statusConfig, useOffers } from "@/data/pages/dashboard/offer";
import DataTable from "@/components/common/DataTable";
import SidePanel from "@/components/ui/SidePanel";

export default function SellerHomeClientView() {
  const { user } = useAuthContext();
  const router = useRouter();
  const detailPanel = useSidePanel<any>();

  const {offers, isLoading} = useOffers();

  const emptyMessage = {
    title: 'No offers found',
    message: 'Your offers will appear here'
  };

  return(
    <>
      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title="Offers Details"
      >
        {detailPanel.selectedItem && (
          <div>
            <h4>Welcome</h4>
          </div>
        )}

      </SidePanel>

      <DashboardWelcomeHeader
        name={user?.user_metadata?.name || ""}
        description='Manage your property listings and documents from your seller dashboard.'
        primaryAction={{ label: 'Create Documents', onClick: () => router.push('/seller-dashboard/documents') }}
        secondaryAction={{ label: 'Upload Properties', onClick: () => router.push('/seller-dashboard/listings') }}
        illustrationSrc="/images/dashboard-welcome.svg"
      />

      <SellerDashboadStats/>

      <DataTable
        title="Recent Offers and Interests"
        columns={columns}
        data={offers}
        pagination={ {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        }}
        loading={isLoading}
        statusConfig={statusConfig}
        getStatus={(row) => row.status}
        onMore={detailPanel.openEdit}
        onPageChange={()=>console.log('page change')}
        onItemsPerPageChange={()=>console.log('items per page change')}
        emptyMessage={emptyMessage}
      /> 

    </>
  )

}