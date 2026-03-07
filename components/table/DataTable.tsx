
'use client';

import * as icon from '@heroicons/react/24/outline';
import type { TableColumn, StatusConfig } from './TableCore';
import TableCore from './TableCore';

export type { TableColumn, StatusConfig };


export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}


export interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  pagination: PaginationData;
  loading?: boolean;

  title?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  onFilter?: () => void;
  showFilter?: boolean;
  filterDropdown?: React.ReactNode;
  activeFiltersSlot?: React.ReactNode;

  statusConfig?: StatusConfig[];
  getStatus?: (row: T) => string;
  
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
  onSort?: (key: string, direction: 'asc' | 'desc' | null) => void;
  
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onMore?: (item: T) => void;
  actionType?: 'more' | 'edit' | 'delete'; 
  showActions?: boolean;

  
  itemsPerPageOptions?: number[];
  className?: string;
  emptyMessage: {
    title: string;
    message: string
  };
  skeletonRows?: number;
  
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | null;
}

function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  pagination,
  loading = false,

  title,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',

  onFilter,
  showFilter = false,
  filterDropdown,
  activeFiltersSlot,

  statusConfig,
  getStatus,
  onPageChange,
  onItemsPerPageChange,
  onSort,
  onEdit,
  onDelete,
  onMore,
  actionType = 'more',
  showActions = true,
  itemsPerPageOptions = [10, 20, 50, 100],
  className = '',
  emptyMessage,
  skeletonRows = 3,
  sortBy,
  sortOrder,
}: DataTableProps<T>) {

  const { page, limit, total, totalPages } = pagination;
  const startIndex = (page - 1) * limit;

  const handleItemsPerPageChange = (value: string) => {
    onItemsPerPageChange(Number(value));
  };

  const goToPage = (newPage: number) => onPageChange(newPage);

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 3; i++) pages.push(i)
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(page);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={`w-full  ${className}`}>
      <div className="bg-card rounded-lg border border-border overflow-hidden ">

        {(title || onSearchChange || filterDropdown) && (
          <div className="px-6 py-4 border-b border-separator">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

              {title && (
                <h2 className="text-sm md:text-lg font-semibold text-heading">
                  {title}
                </h2>
              )}

              <div className='flex gap-4'>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {onSearchChange && (
                    <div className="relative flex-1 sm:flex-initial">
                      <icon.MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary" />
                      <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="pl-10 pr-3 py-2 w-full sm:w-64 bg-background border border-border rounded-lg text-sm text-text placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                      />
                    </div>
                  )}
                  
                  {showFilter && onFilter && (
                    <button
                      onClick={onFilter}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm text-text hover:bg-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                    >
                      <icon.FunnelIcon className="h-4 w-4" />
                      Filter
                    </button>
                  )}
                </div>

                {filterDropdown}
              </div>

            </div>
          </div>
        )}
        
        {activeFiltersSlot && (
          <div className="px-6 border-b border-separator">
            {activeFiltersSlot}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <TableCore
              columns={columns}
              data={data}
              loading={loading}
              startIndex={startIndex}
              statusConfig={statusConfig}
              getStatus={getStatus}
              onEdit={onEdit}
              onDelete={onDelete}
              onMore={onMore}
              actionType={actionType}
              showActions={showActions}
              emptyMessage={emptyMessage}
              skeletonRows={skeletonRows}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
          </table>
        </div>

        {(total > 10 || loading) && (
          <div className="px-6 py-4 bg-background border-t border-separator">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <select
                  value={limit}
                  onChange={(e) => handleItemsPerPageChange(e.target.value)}
                  disabled={loading}
                  className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-secondary">
                  Items per page
                </span>
                {!loading && (
                  <span className="text-sm text-secondary ml-4">
                    {startIndex + 1}-{Math.min(startIndex + limit, total)} of {total} items
                  </span>
                )}
                {loading && (
                  <span className="text-sm text-secondary ml-4">
                    ...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1 || loading}
                  className="px-3 py-1.5 text-sm text-secondary hover:text-heading disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>

                {generatePageNumbers().map((pageNum, index) => (
                  <button
                    key={index}
                    onClick={() => typeof pageNum === 'number' && goToPage(pageNum)}
                    disabled={pageNum === '...' || loading}
                    className={`
                      px-3 py-1.5 text-sm rounded-lg transition-colors
                      ${pageNum === page
                        ? 'bg-accent text-secondary'
                        : pageNum === '...'
                        ? 'cursor-default text-secondary'
                        : 'hover:bg-hover text-secondary hover:text-heading'
                      }
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages || loading}
                  className="px-3 py-1.5 text-sm text-secondary hover:text-heading disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default DataTable;