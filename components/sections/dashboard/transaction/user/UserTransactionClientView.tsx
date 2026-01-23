"use client"

import SidePanel from "@/components/ui/SidePanel";
import { useSidePanel } from "@/hooks/useSidePanel";
import { useTransactions } from "@/hooks/useSpecialized/useTransaction";
import { useMemo} from "react";
import UserTransactionDetails from "./UserTransactionDetails";
import DataTable from "@/components/common/DataTable";
import { columns, statusConfig } from "@/data/pages/dashboard/transaction";
import FilterDropdown from "@/components/common/FilterDropdown";
import ActiveFilters from "@/components/common/ActiveFilters";
import { transactionFilterConfigs } from "../common/TransactionFilter";
import { TransactionBase } from "@/type/pages/dashboard/transactions";
import { useTableFilters } from "@/hooks/useTableQuery";
import { getTableEmptyMessage } from "@/components/common/TableEmptyMessage";


export default function UserTransactionClientView() {
  const detailPanel = useSidePanel<TransactionBase>();

  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: [], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: ['applications'],
  }), [baseQueryParams]);

  const { transactions, pagination, isLoading } = useTransactions(queryParams);

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
          <UserTransactionDetails transaction={detailPanel.selectedItem} />
        )}

      </SidePanel>

      <DataTable
        title="Payment History"
        columns={columns}
        data={transactions}
        pagination={pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        }}
        loading={isLoading}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search description"
        filterDropdown={
          <FilterDropdown
            filters={filters}
            filterConfigs={transactionFilterConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        activeFiltersSlot={
          <ActiveFilters
            filters={filters}
            filterConfigs={transactionFilterConfigs}
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