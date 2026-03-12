'use client';

import SidePanel from "@/components/ui/SidePanel";
import { SellerTransactionscolumns, SellerTransactionstatusConfig} from "@/data/pages/dashboard/transaction";
import { useSidePanel } from "@/hooks/useSidePanel";
import { useTableFilters } from "@/hooks/useTableQuery";
import { TransactionBase } from "@/type/pages/dashboard/transactions";
import { useMemo } from "react";
import SellerTransactionDetail from "./SellerTransactionDetails";
import DataTable from "@/components/table/DataTable";
import FilterDropdown from "@/components/table/FilterDropdown";
import { sellerTransactionFilterConfigs } from "../common/TransactionFilter";
import ActiveFilters from "@/components/table/ActiveFilters";
import { getTableEmptyMessage } from "@/components/table/TableEmptyMessage";
import { useSellerTransactions,} from "@/hooks/useSpecialized/useTransaction";
import ErrorState from "@/components/feedbacks/ErrorState";


export default function SellerTransactionClientView (){

  const detailPanel = useSidePanel<TransactionBase>();

  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: [], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: ['properties'],
  }), [baseQueryParams]);

 
  const { items:transactions, pagination, isLoading, error, refresh } =  useSellerTransactions(queryParams);

  if (error) {
    return (
      <ErrorState
        message="Error loading transaction tables"
        retryLabel="Reload transactions"
        onRetry={refresh}
      />
    );
  }

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
