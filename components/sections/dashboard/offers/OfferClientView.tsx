'use client';

import FilterDropdown from "@/components/common/FilterDropdown";
import SidePanel from "@/components/ui/SidePanel";
import { columns, statusConfig, useOffers } from "@/data/pages/dashboard/offer";
import { useSidePanel } from "@/hooks/useSidePanel";
import { useTableFilters } from "@/hooks/useTableQuery";
import { useMemo } from "react";
import { offerFilterConfigs } from "./OfferFilter";
import ActiveFilters from "@/components/common/ActiveFilters";
import DataTable from "@/components/common/DataTable";
import OfferDetails from "./OfferDetails";

export default function OfferClientView (){
  const detailPanel = useSidePanel<any>();

  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: ['property'], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: ['properties','users'],
  }), [baseQueryParams]);

  const {offers, isLoading} = useOffers(queryParams);

  const emptyMessage = useMemo(() => {
    if (hasActiveFilters) {
      return { title: 'No offers yet', message: 'Try adjusting your filters or search query',};
    }
    return {title: 'No offers found', message: 'Your offers will appear here'};
  }, [hasActiveFilters]);



  return(
    <div>
      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title="Offers Details"
      >
        {detailPanel.selectedItem && (
          <div>
            <OfferDetails offer={detailPanel.selectedItem} />
          </div>
        )}

      </SidePanel>

      <DataTable
        title="Offers and Interests"
        columns={columns}
        data={offers}
        pagination={ {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        }}
        loading={isLoading}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by description"
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
        skeletonRows={5}
      /> 
    </div>
  )
}