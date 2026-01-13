'use client';

import { useMemo } from 'react';
import DataTable from '@/components/common/DataTable';
import FilterDropdown from '@/components/common/FilterDropdown';
import ActiveFilters from '@/components/common/ActiveFilters';
import SidePanel from '@/components/ui/SidePanel';
import { columns, statusConfig } from '@/data/pages/dashboard/home';
import { useSidePanel } from '@/hooks/useSidePanel';
import { useApplications } from '@/hooks/useSpecialized/useApplications';
import { ApplicationDetails } from '@/components/sections/dashboard/application/ApplicationDetail';
import { applicationFilterConfigs } from '@/components/sections/dashboard/application/ApplicationFilters';
import { ApplicationBase } from '@/type/pages/dashboard/application';
import { useTableFilters } from '@/hooks/useTableQuery';


export default function UserApplicationClientView() {
  const detailPanel = useSidePanel<ApplicationBase>();

  const {
    sortBy,
    sortOrder,
    searchValue,
    filters,
    queryParams: baseQueryParams,
    hasActiveFilters,
    handlePageChange,
    handleItemsPerPageChange,
    handleSort,
    handleFilterChange,
    handleSearchChange,
  } = useTableFilters({
    initialFilters: {
      status: '',
      current_stage: '',
    },
    searchFields: ['properties.title'],
    defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({
    ...baseQueryParams,
    include: ['properties', 'pre_approvals'],
  }), [baseQueryParams]);

  const { applications, pagination, isLoading } = useApplications(queryParams);

  const emptyMessage = useMemo(() => {
    if (hasActiveFilters) {
      return { title: 'No applications found', message: 'Try adjusting your filters or search query'};
    }
    return { title: 'No applications found', message: 'Your applications will appear here'};

  }, [hasActiveFilters]);

  return (
    <>
      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title="Application Details"
      >
        {detailPanel.selectedItem && (
          <ApplicationDetails application={detailPanel.selectedItem} />
        )}
      </SidePanel>

      <DataTable
        title="All Applications"
        columns={columns}
        data={applications}
        pagination={pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }}
        loading={isLoading}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by property name "
        filterDropdown={
          <FilterDropdown
            filters={filters}
            filterConfigs={applicationFilterConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        activeFiltersSlot={
          <ActiveFilters
            filters={filters}
            filterConfigs={applicationFilterConfigs}
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
    </>
  );
}