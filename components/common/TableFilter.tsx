'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  placeholder?: string;
}

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  label: string;
  placeholder?: string;
}

function Combobox({ value, onChange, options, label, placeholder = 'Select...' }: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-secondary mb-1.5">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-background border border-border rounded-lg text-sm text-text hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transition-colors"
      >
        <span className={selectedOption ? 'text-text' : 'text-secondary'}>
          {selectedOption?.label || placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && (
            <XMarkIcon
              className="h-4 w-4 text-secondary hover:text-accent"
              onClick={handleClear}
            />
          )}
          <ChevronDownIcon
            className={`h-4 w-4 text-secondary transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-separator">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-1.5 bg-background border border-border rounded text-sm text-text placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-hover transition-colors ${
                    option.value === value
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-text'
                  }`}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-secondary text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface TableFiltersProps {
  filters: Record<string, string>;
  filterConfigs: FilterConfig[];
  onFilterChange: (filters: Record<string, string>) => void;
  className?: string;
}

export default function TableFilters({
  filters,
  filterConfigs,
  onFilterChange,
  className = '',
}: TableFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleClearAll = () => {
    const clearedFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {} as Record<string, string>);
    onFilterChange(clearedFilters);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter Comboboxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filterConfigs.map((config) => (
          <Combobox
            key={config.key}
            value={filters[config.key] || ''}
            onChange={(value) => handleFilterChange(config.key, value)}
            options={config.options}
            label={config.label}
            placeholder={config.placeholder}
          />
        ))}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between p-3 bg-accent/5 border border-accent/20 rounded-lg">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-text">Active Filters:</span>
            
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              
              const config = filterConfigs.find(c => c.key === key);
              const option = config?.options.find(o => o.value === value);
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-xs font-medium"
                >
                  {config?.label}: {option?.label || value}
                  <button
                    onClick={() => handleFilterChange(key, '')}
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
      )}
    </div>
  );
}

// Export types for reuse
export type { TableFiltersProps, ComboboxProps };