import { columns, statusConfig } from "@/data/pages/dashboard/application";
import { useTableFilters } from "@/hooks/useTableQuery";
import { useMemo } from "react";
import DataTable from "@/components/table/DataTable";
import FilterDropdown from "@/components/table/FilterDropdown";
import { adminApplicationConfigs } from "./AdminApplicationsFilters";
import ActiveFilters from "@/components/table/ActiveFilters";
import { getTableEmptyMessage } from "@/components/table/TableEmptyMessage";
import { useAdminApplications } from "@/hooks/useSpecialized/useApplications";
import ErrorState from "@/components/feedbacks/ErrorState";

export default function AdminPreMortgageClientView ({detailPanel}:any){
  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: [], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: ['properties'],
  }), [baseQueryParams]);

  const {items:applications, isLoading, pagination, error, refresh}= useAdminApplications(queryParams);

  if (error) {
    return (
      <ErrorState
        message="Error loading application tables"
        retryLabel="Reload applications"
        onRetry={refresh}
      />
    );
  }

  const emptyMessage = useMemo(
    () => getTableEmptyMessage(hasActiveFilters, 'applications'),
    [hasActiveFilters]
  );

  return(
    <div>
      <DataTable
        title="Applications"
        columns={columns}
        data={applications}
        pagination={pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        }}
        loading={isLoading}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search property"
        filterDropdown={
          <FilterDropdown
            filters={filters}
            filterConfigs={adminApplicationConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        activeFiltersSlot={
          <ActiveFilters
            filters={filters}
            filterConfigs={adminApplicationConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        statusConfig={statusConfig}
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
