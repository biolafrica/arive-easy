'use client';

import { getTableEmptyMessage } from "@/components/common/TableEmptyMessage";
import SidePanel from "@/components/ui/SidePanel";
import { useSidePanel } from "@/hooks/useSidePanel";
import { useSellerPartnerDocuments } from "@/hooks/useSpecialized/useDocuments";
import { useTableFilters } from "@/hooks/useTableQuery";
import { PartnerDocumentBase } from "@/type/pages/dashboard/documents";
import { useMemo } from "react";
import PartnerDetail from "../admin/PartnerDetail";
import DataTable from "@/components/common/DataTable";
import { partnerStatusConfig, sellerColumns } from "@/data/pages/dashboard/documents";
import FilterDropdown from "@/components/common/FilterDropdown";
import { sellerConfigs } from "../common/DocumentFilter";
import ActiveFilters from "@/components/common/ActiveFilters";
import { TableHeader } from "@/components/common/TableHeader";

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

  const{ sellers, isLoading, pagination} = useSellerPartnerDocuments(queryParams);

  const emptyMessage = useMemo(
    () => getTableEmptyMessage(hasActiveFilters, 'seller documents'),
    [hasActiveFilters]
  );

  return (
    <div className="space-y-5">
      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title={detailPanel.mode === 'edit' ? 'Document Details' : 'Create Document'}
      >
        {detailPanel.mode === 'edit' && detailPanel.selectedItem ? 
          (<PartnerDetail/>):
          (<PartnerDetail/>)
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