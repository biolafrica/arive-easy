"use client";

import { getTableEmptyMessage } from "@/components/common/TableEmptyMessage";
import SidePanel from "@/components/ui/SidePanel";
import { columns, statusConfig, useAdminProperty } from "@/data/pages/dashboard/property";
import { useSidePanel } from "@/hooks/useSidePanel";
import { useTableFilters } from "@/hooks/useTableQuery";
import { useMemo } from "react";
import AdminPropertyDetails from "./AdminPropertyDetails";
import DataTable from "@/components/common/DataTable";
import FilterDropdown from "@/components/common/FilterDropdown";
import ActiveFilters from "@/components/common/ActiveFilters";
import { adminPropertyFilterConfigs } from "./PropertyFilter";

export default function AdminPropertyClientView (){
  const detailPanel = useSidePanel<any>();


  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: ['name'], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: ['users'],
  }), [baseQueryParams]);

    const {properties, isLoading} =  useAdminProperty(queryParams);

  const emptyMessage = useMemo(
    () => getTableEmptyMessage(hasActiveFilters, 'properties'),
    [hasActiveFilters]
  );

  return(
    <div>
      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title="Transaction Details"
      >
        {detailPanel.selectedItem && (
          <AdminPropertyDetails property={detailPanel.selectedItem} />
        )}
      </SidePanel>

      <DataTable
        title="Properties"
        columns={columns}
        data={properties}
        pagination={ {
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