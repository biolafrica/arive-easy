'use client';

import { getTableEmptyMessage } from "@/components/common/TableEmptyMessage";
import SidePanel from "@/components/ui/SidePanel";
import { adminTransactionscolumns, statusConfig, useAdminTransactions } from "@/data/pages/dashboard/transaction";
import { useSidePanel } from "@/hooks/useSidePanel";
import { useTableFilters } from "@/hooks/useTableQuery";
import { AdminTransactionBase } from "@/type/pages/dashboard/transactions";
import { useMemo } from "react";
import AdminTransactionDetail from "./AdminTransactionDetails";
import DataTable from "@/components/common/DataTable";
import FilterDropdown from "@/components/common/FilterDropdown";
import ActiveFilters from "@/components/common/ActiveFilters";
import { adminTransactionFilterConfigs } from "../common/TransactionFilter";

export default function AdminTransactionClientView() {
  const detailPanel = useSidePanel<AdminTransactionBase>();

  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: ['id'], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: ['users'],
  }), [baseQueryParams]);

  const {transactions, isLoading} = useAdminTransactions(queryParams);


  const emptyMessage = useMemo(
    () => getTableEmptyMessage(hasActiveFilters, 'transactions'),
    [hasActiveFilters]
  );

  return (
    <div>
      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title="Transaction Details"
      >
        {detailPanel.selectedItem && (
          <AdminTransactionDetail transaction={detailPanel.selectedItem} />
        )}

      </SidePanel>

      <DataTable
        title="Payment History"
        columns={adminTransactionscolumns}
        data={transactions}
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
            filterConfigs={adminTransactionFilterConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        activeFiltersSlot={
          <ActiveFilters
            filters={filters}
            filterConfigs={adminTransactionFilterConfigs}
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
  );
  
}
