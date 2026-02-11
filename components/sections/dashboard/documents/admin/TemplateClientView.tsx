import { getTableEmptyMessage } from "@/components/common/TableEmptyMessage";
import SidePanel from "@/components/ui/SidePanel";
import { useSidePanel } from "@/hooks/useSidePanel";
import { useTemplateDocuments } from "@/hooks/useSpecialized/useDocuments";
import { useTableFilters } from "@/hooks/useTableQuery";
import { TemplateBase } from "@/type/pages/dashboard/documents";
import { useMemo } from "react";
import TemplateDetail from "./TemplateDetail";
import DataTable from "@/components/common/DataTable";
import { columns, statusConfig } from "@/data/pages/dashboard/documents";
import FilterDropdown from "@/components/common/FilterDropdown";
import ActiveFilters from "@/components/common/ActiveFilters";
import { templateConfigs } from "../common/DocumentFilter";

export default function TemplateClientView() {
  const detailPanel = useSidePanel<TemplateBase>();

  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams,     
    hasActiveFilters, handlePageChange, handleItemsPerPageChange, handleSort,
    handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '' },searchFields: [], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: [],
  }), [baseQueryParams]);

  const{templates, isLoading, pagination} = useTemplateDocuments(queryParams);


  const emptyMessage = useMemo(
    () => getTableEmptyMessage(hasActiveFilters, 'template documents'),
    [hasActiveFilters]
  );

  return (
    <div className="space-y-5">
      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title="Template Document Detail"
      >
        {detailPanel.selectedItem && (
          <TemplateDetail/>
        )}

      </SidePanel>

      <DataTable
        title="Template Table"
        columns={columns}
        data={templates}
        pagination={pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        }}
        loading={isLoading}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search user"
        filterDropdown={
          <FilterDropdown
            filters={filters}
            filterConfigs={templateConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        activeFiltersSlot={
          <ActiveFilters
            filters={filters}
            filterConfigs={templateConfigs}
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