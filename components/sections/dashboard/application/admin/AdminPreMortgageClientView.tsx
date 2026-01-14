import { columns, statusConfig, usePreApplications } from "@/data/pages/dashboard/application";
import { useTableFilters } from "@/hooks/useTableQuery";
import { useMemo } from "react";
import DataTable from "@/components/common/DataTable";
import FilterDropdown from "@/components/common/FilterDropdown";
import { adminApplicationConfigs } from "./AdminApplicationsFilters";
import ActiveFilters from "@/components/common/ActiveFilters";

export default function AdminPreMortgageClientView ({detailPanel}:any){
  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: ['name'], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: ['users'],
  }), [baseQueryParams]);

  const {applications, isLoading}=usePreApplications(queryParams)

  const emptyMessage = useMemo(() => {
    if (hasActiveFilters) {
      return { title: 'No application found', message: 'Try adjusting your filters or search query',};
    }
    return {title: 'No applications found', message: 'Your applications will appear here'};
  }, [hasActiveFilters]);

  return(
    <div>
      <DataTable
        title="Applications"
        columns={columns}
        data={applications}
        pagination={ {
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
        onMore={detailPanel.openAdd}
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
