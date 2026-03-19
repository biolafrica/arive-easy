"use client";

import { getTableEmptyMessage } from "@/components/table/TableEmptyMessage";
import { columns, statusConfig } from "@/data/pages/dashboard/property";
import { useTableFilters } from "@/hooks/useTableQuery";
import { useMemo } from "react";
import DataTable from "@/components/table/DataTable";
import FilterDropdown from "@/components/table/FilterDropdown";
import ActiveFilters from "@/components/table/ActiveFilters";
import { adminPropertyFilterConfigs } from "./PropertyFilter";
import { useAdminProperties } from "@/hooks/useSpecialized";
import ErrorState from "@/components/feedbacks/ErrorState";
import { AdminDashboardStats } from "@/components/common/AdminDashboardStats";

export default function AdminPropertyClientView ({detailPanel}:any){

  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: [], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: ['users'],
  }), [baseQueryParams]);

  const {properties, isLoading, pagination, error, refresh} = useAdminProperties(queryParams);
  
  if (error) {
    return (
      <ErrorState
        message="Error loading property tables"
        retryLabel="Reload properties"
        onRetry={refresh}
      />
    );
  }

  const emptyMessage = useMemo(
    () => getTableEmptyMessage(hasActiveFilters, 'properties'),
    [hasActiveFilters]
  );


  return(
    <div className="space-y-4">
      <AdminDashboardStats section="properties" />

      <DataTable
        title="Properties"
        columns={columns}
        data={properties}
        pagination={ pagination ||{
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
            filterConfigs={adminPropertyFilterConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        activeFiltersSlot={
          <ActiveFilters
            filters={filters}
            filterConfigs={adminPropertyFilterConfigs}
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