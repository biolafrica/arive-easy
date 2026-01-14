import { useTableFilters } from "@/hooks/useTableQuery";
import { useMemo } from "react";
import DataTable from "@/components/common/DataTable";
import { columns, statusConfig, usePreApprovals } from "@/data/pages/dashboard/approval";
import FilterDropdown from "@/components/common/FilterDropdown";
import { adminPreApprovalConfigs } from "./AdminApplicationsFilters";
import ActiveFilters from "@/components/common/ActiveFilters";

export default function AdminPreApprovalClientView ({detailPanel}:any){
  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: ['name'], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: ['users'],
  }), [baseQueryParams]);

  const{pre_approvals, isLoading}= usePreApprovals(queryParams)

  const emptyMessage = useMemo(() => {
    if (hasActiveFilters) {
      return { title: 'No pre-approval found', message: 'Try adjusting your filters or search query',};
    }
    return {title: 'No pre_approval found', message: 'Your pre_approvals will appear here'};
  }, [hasActiveFilters]);


  return(
    <div>
      <DataTable
        title="Pre-Approvals"
        columns={columns}
        data={pre_approvals}
        pagination={ {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        }}
        loading={isLoading}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search user"
        filterDropdown={
          <FilterDropdown
            filters={filters}
            filterConfigs={adminPreApprovalConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        activeFiltersSlot={
          <ActiveFilters
            filters={filters}
            filterConfigs={adminPreApprovalConfigs}
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