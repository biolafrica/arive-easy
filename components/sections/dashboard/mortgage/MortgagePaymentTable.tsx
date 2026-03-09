import { useMemo } from "react";
import { useMortgagePayments } from "@/hooks/useSpecialized/useMortgagePayment";
import { useTableFilters } from "@/hooks/useTableQuery";

import ActiveFilters from "@/components/table/ActiveFilters";
import DataTable from "@/components/table/DataTable";
import FilterDropdown from "@/components/table/FilterDropdown";
import { getTableEmptyMessage } from "@/components/table/TableEmptyMessage";
import { columns, filterConfigs, statusConfig } from "@/data/pages/dashboard/mortgage";
import ErrorState from "@/components/feedbacks/ErrorState";



export default function MortgagePaymentTable({id}: {id: string}) { 

  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: [], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: [],
  }), [baseQueryParams]);

  queryParams.filters = {
    ...queryParams.filters,
    mortgage_id:id,
  }

  const {mortgagePayments, isLoading, pagination, error, refresh} = useMortgagePayments(queryParams);

  if (error) {
    return (
      <ErrorState
        message="Error loading mortgage payments"
        retryLabel="Reload mortgage payments"
        onRetry={refresh}
      />
    );
  }

  const emptyMessage = useMemo(
    () => getTableEmptyMessage(hasActiveFilters, 'mortage payments'),
    [hasActiveFilters]
  );

  return(
    <div>
      <DataTable
        title="Mortgage Payment History"
        columns={columns}
        data={mortgagePayments}
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
            filterConfigs={filterConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        activeFiltersSlot={
          <ActiveFilters
            filters={filters}
            filterConfigs={filterConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        statusConfig={statusConfig}
        getStatus={(row) => row.status}
        showActions={false}
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