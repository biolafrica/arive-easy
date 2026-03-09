'use client';

import { useMemo } from "react";

import { useTableFilters } from "@/hooks/useTableQuery";
import { useSellerPartnerDocuments } from "@/hooks/useSpecialized/useDocuments";
import { useSidePanel } from "@/hooks/useSidePanel";

import { PartnerDocumentBase } from "@/type/pages/dashboard/documents";

import { getTableEmptyMessage } from "@/components/table/TableEmptyMessage";
import SidePanel from "@/components/ui/SidePanel";
import DataTable from "@/components/table/DataTable";
import { partnerStatusConfig, sellerColumns } from "@/data/pages/dashboard/documents";
import FilterDropdown from "@/components/table/FilterDropdown";
import { sellerConfigs } from "../common/DocumentFilter";
import ActiveFilters from "@/components/table/ActiveFilters";
import { TableHeader } from "@/components/table/TableHeader";
import EditPartnerDetails from "../admin/EditPartnerDetails";
import CreatePartnerDetails from "../admin/CreatePartnerDetails";
import ErrorState from "@/components/feedbacks/ErrorState";

export default function DocumentClientView() {
  const detailPanel = useSidePanel<PartnerDocumentBase>();

  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: [], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: [],
  }), [baseQueryParams]);

  const{ sellers, isLoading, pagination, error, refresh} = useSellerPartnerDocuments(queryParams);

  if (error) {
    return (
      <ErrorState
        message="Error loading seller documents"
        retryLabel="Reload documents"
        onRetry={refresh}
      />
    );
  }

  const emptyMessage = useMemo(
    () => getTableEmptyMessage(hasActiveFilters, 'seller documents'),
    [hasActiveFilters]
  );

  const handleClose =()=>{
    detailPanel.close()
  }

  return (
    <div className="space-y-5">
      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title={detailPanel.mode === 'edit' ? 'Document Details' : 'Create Document'}
      >
        {detailPanel.mode === 'edit' && detailPanel.selectedItem ? 
          (<EditPartnerDetails document={detailPanel.selectedItem}/>):
          (<CreatePartnerDetails  close={handleClose}/>)
        }

      </SidePanel>

      <TableHeader
        title="Documents"
        subtitle="List of all documents you created."
        createLabel="Create Document"
        onCreate={detailPanel.openAdd}
      />

      <DataTable
        title="Document Table"
        columns={sellerColumns}
        data={sellers}
        pagination={pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        }}
        loading={isLoading}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search document name"
        filterDropdown={
          <FilterDropdown
            filters={filters}
            filterConfigs={sellerConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        activeFiltersSlot={
          <ActiveFilters
            filters={filters}
            filterConfigs={sellerConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        statusConfig={partnerStatusConfig}
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