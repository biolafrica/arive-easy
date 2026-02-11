import { getTableEmptyMessage } from "@/components/common/TableEmptyMessage";
import SidePanel from "@/components/ui/SidePanel";
import { useSidePanel } from "@/hooks/useSidePanel";
import { usePartnerDocuments } from "@/hooks/useSpecialized/useDocuments";
import { useTableFilters } from "@/hooks/useTableQuery";
import { PartnerDocumentBase } from "@/type/pages/dashboard/documents";
import { useMemo } from "react";
import PartnerDetail from "./PartnerDetail";
import DataTable from "@/components/common/DataTable";
import { partnerColumns, partnerStatusConfig } from "@/data/pages/dashboard/documents";
import FilterDropdown from "@/components/common/FilterDropdown";
import { partnerConfigs } from "../common/DocumentFilter";
import ActiveFilters from "@/components/common/ActiveFilters";

export default function SellerDocumentClientView() {
  const detailPanel = useSidePanel<PartnerDocumentBase>();

  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: [], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: [],
  }), [baseQueryParams]);

  const{partners, isLoading, pagination} = usePartnerDocuments(queryParams);

  const emptyMessage = useMemo(
    () => getTableEmptyMessage(hasActiveFilters, 'partner documents'),
    [hasActiveFilters]
  );

  return (
    <div className="space-y-5">
      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title="Partner Document Detail"
      >
        {detailPanel.selectedItem && (
          <PartnerDetail/>
        )}

      </SidePanel>

      <DataTable
        title="Partners Table"
        columns={partnerColumns}
        data={partners}
        pagination={pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        }}
        loading={isLoading}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search name"
        filterDropdown={
          <FilterDropdown
            filters={filters}
            filterConfigs={partnerConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        activeFiltersSlot={
          <ActiveFilters
            filters={filters}
            filterConfigs={partnerConfigs}
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