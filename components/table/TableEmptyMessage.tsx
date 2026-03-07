type EmptyMessageConfig = {
  title: string;
  message: string;
};

export const getTableEmptyMessage = (
  hasActiveFilters: boolean,
  table: string
): EmptyMessageConfig => {
  if (hasActiveFilters) {
    return {
      title: `No ${table} found`,
      message: 'Try adjusting your filters or search query',
    };
  }
  
  return {
    title: `No ${table} found`,
    message: `Your ${table} will appear here`,
  };
};