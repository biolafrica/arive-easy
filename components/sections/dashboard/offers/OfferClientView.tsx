'use client';

import FilterDropdown from "@/components/common/FilterDropdown";
import SidePanel from "@/components/ui/SidePanel";
import { columns, statusConfig, } from "@/data/pages/dashboard/offer";
import { useSidePanel } from "@/hooks/useSidePanel";
import { useTableFilters } from "@/hooks/useTableQuery";
import { useMemo } from "react";
import { offerFilterConfigs } from "./OfferFilter";
import ActiveFilters from "@/components/common/ActiveFilters";
import DataTable from "@/components/common/DataTable";
import OfferDetails from "./OfferDetails";
import { useSellerOffers } from "@/hooks/useSpecialized/useOffers";
import { getTableEmptyMessage } from "@/components/common/TableEmptyMessage";
import { OfferBase } from "@/type/pages/dashboard/offer";

export interface Props{
  value:string
}

export default function OfferClientView ({value=''}){
  const detailPanel = useSidePanel<OfferBase>();

  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: [], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: ['properties','users'],
  }), [baseQueryParams]);

  
  const {offers, isLoading, pagination} = useSellerOffers(queryParams, value);

  const emptyMessage = useMemo(
    () => getTableEmptyMessage(hasActiveFilters, 'offers'),
    [hasActiveFilters]
  );

  const handleClose=()=>{
    detailPanel.close()
  }



  return(
    <div>
      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title="Offers Details"
      >
        {detailPanel.selectedItem && (
          <div>
            <OfferDetails offer={detailPanel.selectedItem} close={handleClose} />
          </div>
        )}

      </SidePanel>

      <DataTable
        title="Offers and Interests"
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
        searchPlaceholder="Search property name"
        filterDropdown={
          <FilterDropdown
            filters={filters}
            filterConfigs={offerFilterConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        activeFiltersSlot={
          <ActiveFilters
            filters={filters}
            filterConfigs={offerFilterConfigs}
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
    </div>
  )
}