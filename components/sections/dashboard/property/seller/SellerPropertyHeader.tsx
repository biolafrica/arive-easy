import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
  searchPlaceholder = 'Search',
  onSearch,
  filters,
  action,
}: DashboardPageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      
      <div>
        <h1 className="text-lg font-semibold text-heading">
          {title}
        </h1>
        {description && (
          <p className=" text-secondary">
            {description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        
        {onSearch && (
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-disabled" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:w-64"
            />
          </div>
        )}


        {filters}

        {action}
      </div>
    </div>
  );
}
