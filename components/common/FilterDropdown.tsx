'use client';

import{ useState, useRef, useEffect } from 'react';
import { FunnelIcon, ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '../primitives/Button';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  placeholder?: string;
  type?: 'select' | 'multiselect';
}

interface FilterDropdownProps {
  filters: Record<string, string | string[]>;
  filterConfigs: FilterConfig[];
  onFilterChange: (filters: Record<string, string | string[]>) => void;
  buttonClassName?: string;
  dropdownClassName?: string;
}

export default function FilterDropdown({
  filters,
  filterConfigs,
  onFilterChange,
  buttonClassName = '',
  dropdownClassName = '',
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSelect, setOpenSelect] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [localFilters, setLocalFilters] = useState(filters);

  const activeFilterCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== '';
  }).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setOpenSelect(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setOpenSelect(null);
  };

  const handleSelectToggle = (key: string) => {
    setOpenSelect(openSelect === key ? null : key);
  };

  const handleSelectChange = (key: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
    setOpenSelect(null);
  };

  const handleMultiSelectChange = (key: string, value: string) => {
    setLocalFilters(prev => {
      const currentValues = (prev[key] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [key]: newValues };
    });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
    setOpenSelect(null);
  };

  const handleReset = () => {
    const resetFilters = Object.keys(localFilters).reduce((acc, key) => {
      const config = filterConfigs.find(c => c.key === key);
      acc[key] = config?.type === 'multiselect' ? [] : '';
      return acc;
    }, {} as Record<string, string | string[]>);
    
    setLocalFilters(resetFilters);
  };

  const handleClearAll = () => {
    handleReset();
    onFilterChange(Object.keys(filters).reduce((acc, key) => {
      const config = filterConfigs.find(c => c.key === key);
      acc[key] = config?.type === 'multiselect' ? [] : '';
      return acc;
    }, {} as Record<string, string | string[]>));
    setIsOpen(false);
  };

  const getSelectedLabel = (config: FilterConfig) => {
    const value = localFilters[config.key];
    
    if (config.type === 'multiselect') {
      const selectedValues = (value as string[]) || [];
      if (selectedValues.length === 0) return config.placeholder || 'Select...';
      if (selectedValues.length === 1) {
        return config.options.find(o => o.value === selectedValues[0])?.label;
      }
      return `${selectedValues.length} selected`;
    }
    
    const option = config.options.find(o => o.value === value);
    return option?.label || config.placeholder || 'Select...';
  };

  const isValueSelected = (configKey: string, optionValue: string) => {
    const value = localFilters[configKey];
    const config = filterConfigs.find(c => c.key === configKey);
    
    if (config?.type === 'multiselect') {
      return (value as string[])?.includes(optionValue) || false;
    }
    
    return value === optionValue;
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={`
          inline-flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm text-text hover:bg-hover hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 
          focus:ring-offset-background transition-colors relative
          ${buttonClassName}
        `}
      >
        <FunnelIcon className="h-4 w-4" />
        <span>Filter</span>
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-accent text-white text-xs font-medium rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`
            absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg bg-white z-50 overflow-hidden
            ${dropdownClassName}
          `}
        >
          <div className="px-4 py-3 border-b border-separator flex items-center justify-between bg-hover">
            <h3 className="text-sm font-semibold text-heading">Filters</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-accent hover:text-accent/80 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {filterConfigs.map((config) => (
              <div key={config.key}>
                <label className="block text-xs font-medium text-secondary mb-1.5">
                  {config.label}
                </label>

                <div className="relative">

                  <button
                    type="button"
                    onClick={() => handleSelectToggle(config.key)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-background border border-border rounded-lg text-sm text-text hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
                  >
                    <span className={
                      (config.type === 'multiselect' && (localFilters[config.key] as string[])?.length > 0) ||
                      (config.type !== 'multiselect' && localFilters[config.key])
                        ? 'text-text'
                        : 'text-secondary'
                    }>
                      {getSelectedLabel(config)}
                    </span>
                    <ChevronDownIcon
                      className={`h-4 w-4 text-secondary transition-transform ${
                        openSelect === config.key ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>

                  {openSelect === config.key && (
                    <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {config.options.map((option) => (

                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            if (config.type === 'multiselect') {
                              handleMultiSelectChange(config.key, option.value);
                            } else {
                              handleSelectChange(config.key, option.value);
                            }
                          }}
                          className={`
                            w-full text-left px-3 py-2 text-sm hover:bg-hover 
                            transition-colors flex items-center justify-between
                            ${isValueSelected(config.key, option.value)
                              ? 'bg-accent/10 text-accent font-medium'
                              : 'text-text'
                            }
                          `}
                        >
                          <span>{option.label}</span>
                          {isValueSelected(config.key, option.value) && (
                            <CheckIcon className="h-4 w-4 text-accent" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-separator flex gap-2 bg-background">
            <Button
              onClick={handleReset}
              variant="outline"
              className='flex-1'
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              className='flex-1'
            >
              Apply
            </Button>
          </div>

        </div>
      )}
    </div>
  );
}


export type { FilterDropdownProps };