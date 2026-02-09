'use client';

import { useState, useCallback } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  filters?: React.ReactNode;
  action?: React.ReactNode;
}


export function DashboardPageHeader({
  title,
  description,
  searchPlaceholder = 'Search title',
  onSearch,
  filters,
  action,
}: DashboardPageHeaderProps) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  }, [onSearch]);

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    onSearch?.('');
  }, [onSearch]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-heading">{title}</h1>
        {description && (
          <p className="text-sm text-secondary">{description}</p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {onSearch && (
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-disabled pointer-events-none" />
            <input
              type="text"
              value={searchValue}
              placeholder={searchPlaceholder}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow sm:w-64"
            />

            {searchValue && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-disabled hover:text-secondary transition-colors"
                aria-label="Clear search"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
            
          </div>
        )}

        {filters}

        {action}
      </div>
    </div>
  );
}


