'use client';

import * as icon from '@heroicons/react/24/outline';
import TableSkeleton from '../skeleton/TableSkeleton';
import EmptyState from './EmptyTable';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  accessor?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
}

export interface StatusConfig {
  value: string;
  label: string;
  variant: 'blue' | 'green' | 'yellow' | 'red';
}

export interface TableCoreProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  startIndex?: number;

  statusConfig?: StatusConfig[];
  getStatus?: (row: T) => string;

  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onMore?: (item: T) => void;
  actionType?: 'more' | 'edit' | 'delete';
  showActions?: boolean;

  emptyMessage: {
    title: string;
    message: string;
  };
  skeletonRows?: number;

  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | null;
  onSort?: (key: string, direction: 'asc' | 'desc' | null) => void;
}

function TableCore<T extends { id?: string | number }>({
  columns,
  data,
  loading = false,
  startIndex = 0,
  statusConfig,
  getStatus,
  onEdit,
  onDelete,
  onMore,
  actionType = 'more',
  showActions = true,
  emptyMessage,
  skeletonRows = 3,
  sortBy,
  sortOrder,
  onSort,
}: TableCoreProps<T>) {

  const handleSort = (key: string) => {
    if (!onSort) return;
    let newDirection: 'asc' | 'desc' | null = 'asc';
    if (sortBy === key) {
      if (sortOrder === 'asc') newDirection = 'desc';
      else if (sortOrder === 'desc') newDirection = null;
    }
    onSort(key, newDirection);
  };

  const getSortIcon = (column: TableColumn<T>) => {
    if (!column.sortable || !onSort) return null;
    const isActive = sortBy === column.key;
    if (!isActive || !sortOrder) {
      return <icon.ChevronUpDownIcon className="h-4 w-4 text-secondary" />;
    }
    return sortOrder === 'asc'
      ? <icon.ChevronUpIcon className="h-4 w-4 text-accent" />
      : <icon.ChevronDownIcon className="h-4 w-4 text-accent" />;
  };

  const getStatusBadge = (row: T) => {
    if (!getStatus || !statusConfig) return null;
    const statusValue = getStatus(row);
    const config = statusConfig.find(s => s.value === statusValue);
    if (!config) return null;
    return (
      <span className={`badge badge-${config.variant}`}>
        {config.label}
      </span>
    );
  };

  const renderAction = (row: T) => {
    switch (actionType) {
      case 'edit':
        return onEdit ? (
          <button
            onClick={() => onEdit(row)}
            className="p-2 hover:bg-hover rounded-lg transition-colors group"
            title="Edit"
          >
            <icon.PencilIcon className="h-4 w-4 text-secondary group-hover:text-accent" />
          </button>
        ) : null;

      case 'delete':
        return onDelete ? (
          <button
            onClick={() => onDelete(row)}
            className="p-2 hover:bg-hover rounded-lg transition-colors group"
            title="Delete"
          >
            <icon.TrashIcon className="h-4 w-4 text-secondary group-hover:text-[var(--btn-danger-bg)]" />
          </button>
        ) : null;

      case 'more':
      default:
        return onMore ? (
          <button
            onClick={() => onMore(row)}
            className="p-2 hover:bg-hover rounded-lg transition-colors group"
            title="Expand row"
          >
            <icon.ArrowsPointingOutIcon className="h-4 w-4 text-secondary group-hover:text-accent" />
          </button>
        ) : null;
    }
  };

  const totalColSpan =
    columns.length +
    1 + // serial col
    (statusConfig ? 1 : 0) +
    (showActions ? 1 : 0);

  return (
    <>
      <thead>
        <tr className="bg-hover border-b border-separator">

          <th className="sticky left-0 z-10 bg-hover w-12 min-w-[3rem] px-3 py-4 text-center text-sm font-medium text-secondary border-r border-separator">
            #
          </th>

          {columns.map((column) => (
            <th
              key={column.key as string}
              className={`
                px-6 py-4 text-left text-sm font-medium text-secondary
                ${column.sortable && onSort ? 'cursor-pointer select-none hover:text-heading' : ''}
                ${column.headerClassName || ''}
              `}
              onClick={() => column.sortable && handleSort(column.key as string)}
            >
              <div className="flex items-center gap-2">
                <span>{column.header}</span>
                {getSortIcon(column)}
              </div>
            </th>
          ))}

          {statusConfig && (
            <th className="px-6 py-4 text-left text-sm font-medium text-secondary">
              Status
            </th>
          )}

          {showActions && (
            <th className="px-6 py-4 text-left text-sm font-medium text-secondary">
              Actions
            </th>
          )}
        </tr>
      </thead>

      <tbody className="divide-y divide-separator">
        {loading ? (
          <TableSkeleton
            columns={columns.length + (statusConfig ? 1 : 0) + 1}
            rows={skeletonRows}
            showActions={showActions}
          />
        ) : data?.length === 0 ? (
          <tr>
            <td
              colSpan={totalColSpan}
              className="px-6 py-12 text-center text-secondary"
            >
              <EmptyState
                title={emptyMessage.title}
                message={emptyMessage.message}
              />
            </td>
          </tr>
        ) : (
          data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className="hover:bg-hover transition-colors"
            >
              <td className="sticky left-0 z-10 bg-card w-12 min-w-[3rem] px-3 py-4 text-center text-sm text-secondary font-medium border-r border-separator">
                {startIndex + rowIndex + 1}
              </td>

              {columns.map((column) => (
                <td
                  key={`${row.id || rowIndex}-${column.key as string}`}
                  className={`
                    px-6 py-4 text-sm text-text whitespace-nowrap
                    ${column.className || ''}
                  `}
                >
                  {column.accessor
                    ? column.accessor(row)
                    : (row[column.key as keyof T] as React.ReactNode)}
                </td>
              ))}

              {statusConfig && (
                <td className="px-6 py-4">
                  {getStatusBadge(row)}
                </td>
              )}

              {showActions && (
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center">
                    {renderAction(row)}
                  </div>
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </>
  );
}

export default TableCore;