'use client';

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  showActions?: boolean;
}

export const SKELETON_WIDTHS = [72, 58, 42, 78, 74];

export function getSkeletonWidth(index: number) {
  return `${SKELETON_WIDTHS[index % SKELETON_WIDTHS.length]}%`;
}

export default function TableSkeleton({ 
  columns, 
  rows = 5, 
  showActions = true 
}: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-separator">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-4">
              <div className="animate-pulse">
                <div 
                  className="h-4 bg-hover rounded"
                  style={{ width: getSkeletonWidth(colIndex) }}
                ></div>
              </div>
            </td>
          ))}
          {showActions && (
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="animate-pulse">
                  <div className="h-8 w-8 bg-hover rounded-lg"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-8 w-8 bg-hover rounded-lg"></div>
                </div>
              </div>
            </td>
          )}
        </tr>
      ))}
    </>
  );
}