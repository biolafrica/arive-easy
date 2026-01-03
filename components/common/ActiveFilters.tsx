'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { FilterConfig } from './FilterDropdown';

interface ActiveFiltersProps {
  filters: Record<string, string | string[]>;
  filterConfigs: FilterConfig[];
  onFilterChange: (filters: Record<string, string | string[]>) => void;
  className?: string;
}

export default function ActiveFilters({
  filters,
  filterConfigs,
  onFilterChange,
  className = '',
}: ActiveFiltersProps) {
  const activeFilters = Object.entries(filters).filter(([_, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== '';
  });

  if (activeFilters.length === 0) return null;

  const handleRemoveFilter = (key: string) => {
    const config = filterConfigs.find(c => c.key === key);
    onFilterChange({
      ...filters,
      [key]: config?.type === 'multiselect' ? [] : '',
    });
  };

  const handleRemoveFilterValue = (key: string, value: string) => {
    const currentValues = filters[key] as string[];
    onFilterChange({
      ...filters,
      [key]: currentValues.filter(v => v !== value),
    });
  };

  const handleClearAll = () => {
    const clearedFilters = Object.keys(filters).reduce((acc, key) => {
      const config = filterConfigs.find(c => c.key === key);
      acc[key] = config?.type === 'multiselect' ? [] : '';
      return acc;
    }, {} as Record<string, string | string[]>);
    onFilterChange(clearedFilters);
  };

  const getFilterLabel = (key: string, value: string | string[]) => {
    const config = filterConfigs.find(c => c.key === key);
    if (!config) return null;

    if (config.type === 'multiselect' && Array.isArray(value)) {
      return value.map(v => {
        const option = config.options.find(o => o.value === v);
        return option?.label || v;
      });
    }

    const option = config.options.find(o => o.value === value);
    return option?.label || value;
  };

  return (
    <div className={`flex my-3 items-center justify-between p-3 bg-accent/5 border border-accent/20 rounded-lg ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-text">Active Filters:</span>
        
        {activeFilters.map(([key, value]) => {
          const config = filterConfigs.find(c => c.key === key);
          
          if (config?.type === 'multiselect' && Array.isArray(value)) {
            return value.map((v) => (
              <span
                key={`${key}-${v}`}
                className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-xs font-medium"
              >
                {config.label}: {getFilterLabel(key, v)}
                <button
                  onClick={() => handleRemoveFilterValue(key, v)}
                  className="hover:bg-accent/20 rounded-full p-0.5 transition-colors"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ));
          }

          return (
            <span
              key={key}
              className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-xs font-medium"
            >
              {config?.label}: {getFilterLabel(key, value)}
              <button
                onClick={() => handleRemoveFilter(key)}
                className="hover:bg-accent/20 rounded-full p-0.5 transition-colors"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          );
        })}
      </div>
      
      <button
        onClick={handleClearAll}
        className="text-sm text-accent hover:text-accent/80 font-medium whitespace-nowrap ml-4"
      >
        Clear All
      </button>
    </div>
  );
}