import { useState, useMemo, useEffect } from 'react';

interface UseTableFiltersOptions {
  initialFilters?: Record<string, string | string[]>;
  searchFields?: string[];
  defaultLimit?: number;
  searchDebounceMs?: number;
}

interface UseTableFiltersReturn {
  // State values
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc' | null;
  searchValue: string;
  debouncedSearch: string;
  filters: Record<string, string | string[]>;
  
  // Computed values
  queryParams: any;
  hasActiveFilters: boolean;
  
  // Handler functions
  handlePageChange: (newPage: number) => void;
  handleItemsPerPageChange: (newLimit: number) => void;
  handleSort: (key: string, direction: 'asc' | 'desc' | null) => void;
  handleFilterChange: (newFilters: Record<string, string | string[]>) => void;
  handleSearchChange: (value: string) => void;
  
  // Reset functions
  resetFilters: () => void;
  resetPagination: () => void;
}

export function useTableFilters(
  options: UseTableFiltersOptions = {}
): UseTableFiltersReturn {
  const {
    initialFilters = {},
    searchFields = [],
    defaultLimit = 10,
    searchDebounceMs = 500,
  } = options;

  // State management
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>(initialFilters);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setPage(1); // Reset to first page on search
    }, searchDebounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, searchDebounceMs]);

  // Build query parameters
  const queryParams = useMemo(() => {
    const params: any = {
      page,
      limit,
    };

    // Add sorting
    if (sortOrder && sortBy) {
      params.sortBy = sortBy;
      params.sortOrder = sortOrder;
    }

    // Add search
    if (debouncedSearch) {
      params.search = debouncedSearch;
      if (searchFields.length > 0) {
        params.searchFields = searchFields;
      }
    }

    // Add filters
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
  }, [page, limit, sortBy, sortOrder, debouncedSearch, filters, searchFields]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== '';
    }) || debouncedSearch !== '';
  }, [filters, debouncedSearch]);

  // Handler functions
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const handleSort = (key: string, direction: 'asc' | 'desc' | null) => {
    setSortBy(key);
    setSortOrder(direction);
    setPage(1); // Reset to first page when sorting changes
  };

  const handleFilterChange = (newFilters: Record<string, string | string[]>) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  // Reset functions
  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchValue('');
    setDebouncedSearch('');
    setPage(1);
  };

  const resetPagination = () => {
    setPage(1);
  };

  return {
    // State values
    page,
    limit,
    sortBy,
    sortOrder,
    searchValue,
    debouncedSearch,
    filters,
    
    // Computed values
    queryParams,
    hasActiveFilters,
    
    // Handler functions
    handlePageChange,
    handleItemsPerPageChange,
    handleSort,
    handleFilterChange,
    handleSearchChange,
    
    // Reset functions
    resetFilters,
    resetPagination,
  };
}