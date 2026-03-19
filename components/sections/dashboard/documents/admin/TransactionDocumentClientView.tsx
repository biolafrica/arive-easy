import ErrorState from "@/components/feedbacks/ErrorState";
import { getTableEmptyMessage } from "@/components/table/TableEmptyMessage";
import { useSidePanel } from "@/hooks/useSidePanel";
import { useAdminTransactional } from "@/hooks/useSpecialized/useDocuments";
import { useTableFilters } from "@/hooks/useTableQuery";
import { TransactionDocumentBase } from "@/type/pages/dashboard/documents";
import { useMemo } from "react";
import TransactionalDocumentDetails from "./TransactionalDetails";
import SidePanel from "@/components/ui/SidePanel";
import DataTable from "@/components/table/DataTable";
import { tStatusConfig, transactionalColumns } from "@/data/pages/dashboard/documents";
import FilterDropdown from "@/components/table/FilterDropdown";
import { transactionConfigs } from "../common/DocumentFilter";
import ActiveFilters from "@/components/table/ActiveFilters";
import { AdminDashboardStats } from "@/components/common/AdminDashboardStats";

export default  function TransactionalDocumentClientView(){
  const detailPanel = useSidePanel<TransactionDocumentBase>();

  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: [], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: [],
  }), [baseQueryParams]);

  const {items:documents, pagination, isLoading, error, refresh } = useAdminTransactional(queryParams)

  if (error) {
    return (
      <ErrorState
        message="Error loading transactional documents"
        retryLabel="Reload document"
        onRetry={refresh}
      />
    );
  }

  const emptyMessage = useMemo(
    () => getTableEmptyMessage(hasActiveFilters, 'documents'),
    [hasActiveFilters]
  );

  return(
    <div className="space-y-4">
      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title="Transactional Documents Detail"
      >
        {detailPanel.selectedItem && (
          <TransactionalDocumentDetails/>
        )}

      </SidePanel>

      <AdminDashboardStats section="transactional-documents" />

      <DataTable
        title="Documents Table"
        columns={transactionalColumns}
        data={documents}
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
            filterConfigs={transactionConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        activeFiltersSlot={
          <ActiveFilters
            filters={filters}
            filterConfigs={transactionConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        statusConfig={tStatusConfig}
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