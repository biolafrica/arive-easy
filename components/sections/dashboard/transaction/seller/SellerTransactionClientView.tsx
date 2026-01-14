'use client';

import SidePanel from "@/components/ui/SidePanel";
import { SellerTransactionscolumns, SellerTransactionstatusConfig, useSellerTransactions } from "@/data/pages/dashboard/transaction";
import { useSidePanel } from "@/hooks/useSidePanel";
import { useTableFilters } from "@/hooks/useTableQuery";
import { SellerTransactionBase } from "@/type/pages/dashboard/transactions";
import { useMemo } from "react";
import SellerTransactionDetail from "./SellerTransactionDetails";
import DataTable from "@/components/common/DataTable";
import FilterDropdown from "@/components/common/FilterDropdown";
import { sellerTransactionFilterConfigs } from "../common/TransactionFilter";
import ActiveFilters from "@/components/common/ActiveFilters";
import { getTableEmptyMessage } from "@/components/common/TableEmptyMessage";

export default function SellerTransactionClientView (){

  const detailPanel = useSidePanel<SellerTransactionBase>();

  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: [''], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: ['properties'],
  }), [baseQueryParams]);

  const {transactions, isLoading} = useSellerTransactions(queryParams);

  const emptyMessage = useMemo(
    () => getTableEmptyMessage(hasActiveFilters, 'transactions'),
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
          <SellerTransactionDetail transaction={detailPanel.selectedItem} />
        )}

      </SidePanel>

      <DataTable
        title="Payment History"
        columns={SellerTransactionscolumns}
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
            filterConfigs={sellerTransactionFilterConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        activeFiltersSlot={
          <ActiveFilters
            filters={filters}
            filterConfigs={sellerTransactionFilterConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        statusConfig={SellerTransactionstatusConfig}
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
