import { getTableEmptyMessage } from "@/components/table/TableEmptyMessage";
import SidePanel from "@/components/ui/SidePanel";
import { useSidePanel } from "@/hooks/useSidePanel";
import { useTemplateDocuments } from "@/hooks/useSpecialized/useDocuments";
import { useTableFilters } from "@/hooks/useTableQuery";
import { TemplateBase } from "@/type/pages/dashboard/documents";
import { useMemo } from "react";
import TemplateDetail from "./TemplateDetail";
import DataTable from "@/components/table/DataTable";
import { columns, statusConfig } from "@/data/pages/dashboard/documents";
import FilterDropdown from "@/components/table/FilterDropdown";
import ActiveFilters from "@/components/table/ActiveFilters";
import { templateConfigs } from "../common/DocumentFilter";
import { TableHeader } from "@/components/table/TableHeader";
import CreateTemplateDetail from "./CreateTemplateDetail";
import ErrorState from "@/components/feedbacks/ErrorState";

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

  const{items:templates, isLoading, pagination, error, refresh} = useTemplateDocuments(queryParams);

  if (error) {
    return (
      <ErrorState
        message="Error loading template documents"
        retryLabel="Reload documents"
        onRetry={refresh}
      />
    );
  }

  const emptyMessage = useMemo(
    () => getTableEmptyMessage(hasActiveFilters, 'template documents'),
    [hasActiveFilters]
  );

  const handleClosePanel=()=>{
    detailPanel.close();

  }

  return (
    <div className="space-y-5">
      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title={detailPanel.mode === 'edit' ? 'Template Document Details' : 'Create Template Document'}
      >
        {detailPanel.mode === 'edit' && detailPanel.selectedItem ? 
          (<TemplateDetail document={detailPanel.selectedItem}/>):
          (<CreateTemplateDetail close={handleClosePanel}/>)
        }

      </SidePanel>

      <TableHeader
        title="Template Documents"
        subtitle="List of all template documents in the system"
        createLabel="Create Document"
        onCreate={detailPanel.openAdd}
      />

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
        searchPlaceholder="Search name"
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