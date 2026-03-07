'use client'

import { getTableEmptyMessage } from "@/components/table/TableEmptyMessage";
import SidePanel from "@/components/ui/SidePanel";
import { useSidePanel } from "@/hooks/useSidePanel";
import { useAdminUsers } from "@/hooks/useSpecialized";
import { useTableFilters } from "@/hooks/useTableQuery";
import { UserBase } from "@/type/user";
import { useMemo } from "react";
import UserDetails from "./UserDetails";
import AddUser from "./AddUser";
import { TableHeader } from "@/components/table/TableHeader";
import DataTable from "@/components/table/DataTable";
import { columns } from "@/data/pages/dashboard/users";
import FilterDropdown from "@/components/table/FilterDropdown";
import ActiveFilters from "@/components/table/ActiveFilters";
import { userFilterConfigs } from "./UserFilter";

export default function UserClientView(){
  const detailPanel = useSidePanel<UserBase>();

  const { sortBy, sortOrder, searchValue, filters, queryParams: baseQueryParams, hasActiveFilters,
    handlePageChange, handleItemsPerPageChange, handleSort, handleFilterChange, handleSearchChange,
  } = useTableFilters({
    initialFilters: { status: '', current_stage: ''},
    searchFields: [], defaultLimit: 10,
  });

  const queryParams = useMemo(() => ({ ...baseQueryParams, include: [],
  }), [baseQueryParams]);

  const { users, pagination, isLoading } = useAdminUsers(queryParams);

  const emptyMessage = useMemo(
    () => getTableEmptyMessage(hasActiveFilters, 'users'),
    [hasActiveFilters]
  );

  const handleClosePanel=()=>{
    detailPanel.close()
  }

  return(
    <div className="space-y-6">

      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title={detailPanel.mode === 'edit' ? 'User Details' : 'Add Member'}
      >
        {detailPanel.mode === 'edit' && detailPanel.selectedItem ? 
          (<UserDetails user={detailPanel.selectedItem}/>):
          (<AddUser close={handleClosePanel}/>)
        }

      </SidePanel>

      <TableHeader
        title="Users Table"
        subtitle="List of Registered User"
        createLabel="Add Team"
        onCreate={detailPanel.openAdd}
      />

      <DataTable
        title="User Table"
        columns={columns}
        data={users}
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
            filterConfigs={userFilterConfigs}
            onFilterChange={handleFilterChange}
          />
        }
        activeFiltersSlot={
          <ActiveFilters
            filters={filters}
            filterConfigs={userFilterConfigs}
            onFilterChange={handleFilterChange}
          />
        }
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