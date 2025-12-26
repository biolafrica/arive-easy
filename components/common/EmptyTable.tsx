'use client'

import { FolderIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'Nothing here yet',
  message = 'There is no content to display.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 text-gray-400">
        {icon || <FolderIcon className="w-12 h-12" />}
      </div>
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <p className="text-gray-500 mt-2 text-sm max-w-md">
        {message}
      </p>
    </div>
  );
}