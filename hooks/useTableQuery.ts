import { useState, useMemo, useEffect } from 'react';

interface UseTableFiltersOptions {
  initialFilters?: Record<string, string | string[]>;
  searchFields?: string[];
  defaultLimit?: number;
  searchDebounceMs?: number;
}

interface UseTableFiltersReturn {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc' | null;
  searchValue: string;
  debouncedSearch: string;
  filters: Record<string, string | string[]>;
  
  queryParams: any;
  hasActiveFilters: boolean;
  
  handlePageChange: (newPage: number) => void;
  handleItemsPerPageChange: (newLimit: number) => void;
  handleSort: (key: string, direction: 'asc' | 'desc' | null) => void;
  handleFilterChange: (newFilters: Record<string, string | string[]>) => void;
  handleSearchChange: (value: string) => void;
  
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

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>(initialFilters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setPage(1);
    }, searchDebounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, searchDebounceMs]);


  const queryParams = useMemo(() => {
    const params: any = {
      page,
      limit,
    };

    if (sortOrder && sortBy) {
      params.sortBy = sortBy;
      params.sortOrder = sortOrder;
    }

    if (debouncedSearch) {
      params.search = debouncedSearch;
      if (searchFields.length > 0) {
        params.searchFields = searchFields;
      }
    }

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

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== '';
    }) || debouncedSearch !== '';
  }, [filters, debouncedSearch]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSort = (key: string, direction: 'asc' | 'desc' | null) => {
    setSortBy(key);
    setSortOrder(direction);
    setPage(1);
  };

  const handleFilterChange = (newFilters: Record<string, string | string[]>) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

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
    page,
    limit,
    sortBy,
    sortOrder,
    searchValue,
    debouncedSearch,
    filters,
    
    queryParams,
    hasActiveFilters,
    
    handlePageChange,
    handleItemsPerPageChange,
    handleSort,
    handleFilterChange,
    handleSearchChange,
    
    resetFilters,
    resetPagination,
  };
}