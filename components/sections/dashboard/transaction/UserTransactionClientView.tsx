"use client"

import SidePanel from "@/components/ui/SidePanel";
import { useSidePanel } from "@/hooks/useSidePanel";
import { useTransactions } from "@/hooks/useSpecialized/useTransaction";
import { useEffect, useMemo, useState } from "react";
import UserTransactionDetails from "./UserTransactionDetails";
import DataTable from "@/components/common/DataTable";
import { columns, statusConfig } from "@/data/pages/dashboard/transaction";
import FilterDropdown from "@/components/common/FilterDropdown";
import ActiveFilters from "@/components/common/ActiveFilters";
import { transactionFilterConfigs } from "./TransactionFilter";
import { TransactionBase } from "@/type/pages/dashboard/transactions";

export default function UserTransactionClientView() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    status: '',
  });

  const detailPanel = useSidePanel<TransactionBase>();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);


  const queryParams = useMemo(() => {
    const params: any = {
      include: ['applications'],
      page,
      limit,
    };

    if (sortOrder && sortBy) {
      params.sortBy = sortBy;
      params.sortOrder = sortOrder;
    }

    if (debouncedSearch) {
      params.search = debouncedSearch;
      params.searchFields = ['type'];
    }

    const activeFilters: Record<string, any> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        activeFilters[key] = value;
      } else if (value && !Array.isArray(value)) {
        activeFilters[key] = value;
      }
    });

    if (Object.keys(activeFilters).length > 0) {
      params.filters = activeFilters;
    }

    return params;
  }, [page, limit, sortBy, sortOrder, debouncedSearch, filters]);


  const { transactions, pagination, isLoading } = useTransactions(queryParams);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSort = (key: string, direction: 'asc' | 'desc' | null) => {
    setSortBy(key);
    setSortOrder(direction);
    setPage(1);
  };

    const handleFilterChange = (newFilters: Record<string, string | string[]>) => {
    setFilters(newFilters);
    setPage(1);
  };

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== '';
    }) || debouncedSearch !== '';
  }, [filters, debouncedSearch]);

  const emptyMessage = useMemo(() => {
    if (hasActiveFilters) {
      return {
        title: 'No transaction found',
        message: 'Try adjusting your filters or search query',
      };
    }
    return {
      title: 'No transaction found',
      message: 'Your applications will appear here',
    };
  }, [hasActiveFilters]);

  return (
    <div>
      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title="Transaction Details"
      >
        <UserTransactionDetails />
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
          hasNextPage: false,
          hasPreviousPage: false,
        }}
        loading={isLoading}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search by property name or application ID..."
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
        skeletonRows={5}
      />
    </div>
  );
}