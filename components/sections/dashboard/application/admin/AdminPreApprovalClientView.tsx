import { useTableFilters } from "@/hooks/useTableQuery";
import { useMemo } from "react";
import DataTable from "@/components/table/DataTable";
import { columns, statusConfig} from "@/data/pages/dashboard/approval";
import FilterDropdown from "@/components/table/FilterDropdown";
import { adminPreApprovalConfigs } from "./AdminApplicationsFilters";
import ActiveFilters from "@/components/table/ActiveFilters";
import { useAdminPrepApprovals } from "@/hooks/useSpecialized/usePreApproval";
import { getTableEmptyMessage } from "@/components/table/TableEmptyMessage";
import ErrorState from "@/components/feedbacks/ErrorState";
import { AdminDashboardStats } from "@/components/common/AdminDashboardStats";

export default function AdminPreApprovalClientView ({detailPanel}:any){

  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: [], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: ['users'],
  }), [baseQueryParams]);

  const{ items:pre_approvals, pagination, isLoading, error, refresh} = useAdminPrepApprovals(queryParams)

  if (error) {
    return (
      <ErrorState
        message="Error loading pre-approvals tables"
        retryLabel="Reload pre-approvals"
        onRetry={refresh}
      />
    );
  }

  const emptyMessage = useMemo(
    () => getTableEmptyMessage(hasActiveFilters, 'pre-approvals'),
    [hasActiveFilters]
  );


  return(
    <div className="space-y-4">

      <AdminDashboardStats section="pre-approvals" />

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