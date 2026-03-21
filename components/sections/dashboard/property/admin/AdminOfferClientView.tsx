import ErrorState from "@/components/feedbacks/ErrorState";
import { getTableEmptyMessage } from "@/components/table/TableEmptyMessage";
import SidePanel from "@/components/ui/SidePanel";
import { useSidePanel } from "@/hooks/useSidePanel";
import { useAdminOffers } from "@/hooks/useSpecialized/useOffers";
import { useTableFilters } from "@/hooks/useTableQuery";
import { OfferBase } from "@/type/pages/dashboard/offer";
import { useMemo } from "react";
import OfferDetails from "../../offers/OfferDetails";
import DataTable from "@/components/table/DataTable";
import { adminOffersFilterConfigs, columns } from "@/data/pages/dashboard/offer";
import FilterDropdown from "@/components/table/FilterDropdown";
import ActiveFilters from "@/components/table/ActiveFilters";
import { adminTransactionFilterConfigs } from "../../transaction/common/TransactionFilter";
import { statusConfig } from "@/data/pages/dashboard/application";

export default function AdminOfferClientView(){
  const detailPanel = useSidePanel<OfferBase>();

  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: [], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: ['users'],
  }), [baseQueryParams]);

  const {items:offers, isLoading, pagination, error, refresh} = useAdminOffers(queryParams);
  
  if (error) {
    return (
      <ErrorState
        message="Error loading offers table"
        retryLabel="Reload offers"
        onRetry={refresh}
      />
    );
  }

  const emptyMessage = useMemo(
    () => getTableEmptyMessage(hasActiveFilters, 'offers'),
    [hasActiveFilters]
  );

  const handleClose =()=>{
    detailPanel.close()
  }

  return(
    <>
      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title="Transaction Details"
      >
        {detailPanel.selectedItem && (
          <OfferDetails close={handleClose} offer={detailPanel.selectedItem} />
        )}
      </SidePanel>

      <DataTable
        title="Sellers Offers"
        columns={columns}
        data={offers}
        pagination={pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        }}
        loading={isLoading}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by property name"
        filterDropdown={
          <FilterDropdown
            filters={filters}
            filterConfigs={adminOffersFilterConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        activeFiltersSlot={
          <ActiveFilters
            filters={filters}
            filterConfigs={adminTransactionFilterConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        statusConfig={statusConfig}
        getStatus={(row) => row.status}
        onMore={detailPanel.openEdit}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        emptyMessage={emptyMessage}
      />
    </>
  )
}