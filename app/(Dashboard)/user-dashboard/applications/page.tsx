'use client';

import { useState, useMemo, useEffect } from 'react';
import DataTable from '@/components/common/DataTable';
import { PageContainer } from '@/components/layouts/dashboard/PageContainer';
import SidePanel from '@/components/ui/SidePanel';
import { columns, statusConfig } from '@/data/pages/dashboard/home';
import { useSidePanel } from '@/hooks/useSidePanel';
import { useApplications } from '@/hooks/useSpecialized/useApplications';
import TableFilters from '@/components/common/TableFilter';
import { applicationFilterConfigs } from '@/components/sections/dashboard/application/ApplicationFilters';
import { ApplicationBase } from '@/type/pages/dashboard/application';
import { ApplicationDetails } from '@/components/sections/dashboard/application/ApplicationDetail';

export default function UserDashboardApplication() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [filters, setFilters] = useState<Record<string, string>>({
    status: '',
    current_stage: '',
  });

  const detailPanel = useSidePanel<ApplicationBase>();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Build query params
  const queryParams = useMemo(() => {
    const params: any = {
      include: ['properties', 'pre_approvals'],
      page,
      limit,
    };

    // Add sorting
    if (sortOrder && sortBy) {
      params.sortBy = sortBy;
      params.sortOrder = sortOrder;
    }

    // Add search
    if (debouncedSearch) {
      params.search = debouncedSearch;
      params.searchFields = ['properties.title', 'application_number'];
    }

    // Add filters
    const activeFilters: Record<string, any> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        activeFilters[key] = value;
      }
    });

    if (Object.keys(activeFilters).length > 0) {
      params.filters = activeFilters;
    }

    return params;
  }, [page, limit, sortBy, sortOrder, debouncedSearch, filters]);

  const { applications, pagination, isLoading } = useApplications(queryParams);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSort = (key: string, direction: 'asc' | 'desc' | null) => {
    setSortBy(key);
    setSortOrder(direction);
    setPage(1);
  };

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== '') || debouncedSearch !== '';
  }, [filters, debouncedSearch]);

  // Empty message based on filter state
  const emptyMessage = useMemo(() => {
    if (hasActiveFilters) {
      return {
        title: 'No applications found',
        message: 'Try adjusting your filters or search query',
      };
    }
    return {
      title: 'No applications found',
      message: 'Your applications will appear here',
    };
  }, [hasActiveFilters]);

  return (
    <>
      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title="Application Details"
      >
        { detailPanel.selectedItem &&(<ApplicationDetails application={detailPanel.selectedItem} />)}
      </SidePanel>

      <PageContainer>
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
          onSearchChange={setSearchValue}
          searchPlaceholder="Search by property name or application ID..."
          showFilterSection={true}
          filterSlot={
            <TableFilters
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
      </PageContainer>
    </>
  );
}