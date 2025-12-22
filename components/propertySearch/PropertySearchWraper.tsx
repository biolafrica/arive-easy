// components/PropertySearchWrapper.tsx
'use client';

import { usePropertySearchFilters } from "@/hooks/usePropertySearchFilter";
import { PropertySearchDesktop } from "./PropertySearch";
import { MobilePropertySearch } from "./MobilePropertysearch";

interface PropertySearchWrapperProps {
  onFiltersApply?: (filters: any) => void;
}

export function PropertySearchWrapper({ onFiltersApply }: PropertySearchWrapperProps) {
  const search = usePropertySearchFilters((filters) => {
    // Call parent callback when filters are applied
    if (onFiltersApply) {
      onFiltersApply(filters);
    }
  });

  // Override submit to trigger the filter application
  const handleSubmit = () => {
    search.submit();
    if (onFiltersApply) {
      onFiltersApply(search.processedFilters);
    }
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <PropertySearchDesktop 
          {...search} 
          submit={handleSubmit}
        />
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <MobilePropertySearch 
          {...search} 
          submit={handleSubmit}
        />
      </div>
    </>
  );
}
