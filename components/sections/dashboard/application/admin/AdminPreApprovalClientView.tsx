import { useTableFilters } from "@/hooks/useTableQuery";
import { useMemo } from "react";
import DataTable from "@/components/common/DataTable";
import { columns, statusConfig} from "@/data/pages/dashboard/approval";
import FilterDropdown from "@/components/common/FilterDropdown";
import { adminPreApprovalConfigs } from "./AdminApplicationsFilters";
import ActiveFilters from "@/components/common/ActiveFilters";
import { useAdminPrepApprovals } from "@/hooks/useSpecialized/usePreApproval";
import { getTableEmptyMessage } from "@/components/common/TableEmptyMessage";

export default function AdminPreApprovalClientView ({detailPanel}:any){

  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: [], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: ['users'],
  }), [baseQueryParams]);

  const{ pre_approvals, pagination, isLoading} = useAdminPrepApprovals(queryParams)

  const emptyMessage = useMemo(
    () => getTableEmptyMessage(hasActiveFilters, 'pre-approvals'),
    [hasActiveFilters]
  );


  return(
    <div>
      <DataTable
        title="Pre-Approvals"
        columns={columns}
        data={pre_approvals}
        pagination={pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        }}
        loading={isLoading}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search user name"
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