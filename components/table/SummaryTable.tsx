'use client';

import * as icon from '@heroicons/react/24/outline';
import TableCore from './TableCore';
import type { TableColumn, StatusConfig } from './TableCore';

export type { TableColumn, StatusConfig };

export interface SummaryTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;

  title: string;
  onViewAll?: () => void;
  viewAllLabel?: string;

  statusConfig?: StatusConfig[];
  getStatus?: (row: T) => string;

  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onMore?: (item: T) => void;
  actionType?: 'more' | 'edit' | 'delete';
  showActions?: boolean;

  className?: string;
  emptyMessage: {
    title: string;
    message: string;
  };
  skeletonRows?: number;
}

function SummaryTable<T extends { id?: string | number }>({
  columns,
  data,
  loading = false,
  title,
  onViewAll,
  viewAllLabel = 'View all',
  statusConfig,
  getStatus,
  onEdit,
  onDelete,
  onMore,
  actionType = 'more',
  showActions = true,
  className = '',
  emptyMessage,
  skeletonRows = 3,
}: SummaryTableProps<T>) {
  return (
    <div className={`w-full ${className}`}>
      <div className="bg-card rounded-lg border border-border overflow-hidden">

        <div className="px-6 py-4 border-b border-separator">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-heading">{title}</h2>

            {onViewAll && (
              <button
                onClick={onViewAll}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline focus:outline-none"
              >
                {viewAllLabel}
                <icon.ArrowRightIcon className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <TableCore
              columns={columns}
              data={data}
              loading={loading}
              startIndex={0} // always starts at 1 — no pagination offset
              statusConfig={statusConfig}
              getStatus={getStatus}
              onEdit={onEdit}
              onDelete={onDelete}
              onMore={onMore}
              actionType={actionType}
              showActions={showActions}
              emptyMessage={emptyMessage}
              skeletonRows={skeletonRows}
            />
          </table>
        </div>

      </div>
    </div>
  );
}

export default SummaryTable;