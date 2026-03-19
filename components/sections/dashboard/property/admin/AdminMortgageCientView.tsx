import { useMemo } from "react";
import { useAdminMortgages } from "@/hooks/useSpecialized/useMortgage";
import { useTableFilters } from "@/hooks/useTableQuery";

import ErrorState from "@/components/feedbacks/ErrorState";
import ActiveFilters from "@/components/table/ActiveFilters";
import DataTable from "@/components/table/DataTable";
import FilterDropdown from "@/components/table/FilterDropdown";
import { getTableEmptyMessage } from "@/components/table/TableEmptyMessage";
import { mStatusConfig, mfilterConfigs, mortgageColums } from "@/data/pages/dashboard/mortgage";
import { AdminDashboardStats } from "@/components/common/AdminDashboardStats";



export default function AdminMortgageClientView({detailPanel}:any){

  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: [], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: [],
  }), [baseQueryParams]);

  const{ items:mortgages, pagination, isLoading, error, refresh} = useAdminMortgages(queryParams)

  if (error) {
    return (
      <ErrorState
        message="Error loading mortgage tables"
        retryLabel="Reload mortgage"
        onRetry={refresh}
      />
    );
  }

  const emptyMessage = useMemo(
    () => getTableEmptyMessage(hasActiveFilters, 'mortgages'),
    [hasActiveFilters]
  );

  return(
    <div className="space-y-4">

      <AdminDashboardStats section="mortgages" />

      <DataTable
        title="Mortgages"
        columns={mortgageColums}
        data={mortgages}
        pagination={ pagination ||{
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        }}
        loading={isLoading}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search"
        filterDropdown={
          <FilterDropdown
            filters={filters}
            filterConfigs={mfilterConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        activeFiltersSlot={
          <ActiveFilters
            filters={filters}
            filterConfigs={mfilterConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        statusConfig={mStatusConfig}
        getStatus={(row) => row.status}
        onMore={detailPanel.openView}
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