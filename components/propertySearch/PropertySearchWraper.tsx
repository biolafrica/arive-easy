'use client';

import { usePropertySearchFilters } from "@/hooks/usePropertySearchFilter";
import { PropertySearchDesktop } from "./PropertySearch";
import { MobilePropertySearch } from "./MobilePropertysearch";
import { useRouter } from "next/navigation";

interface PropertySearchWrapperProps {
  onFiltersApply?: (filters: any) => void;
  home?: boolean;
}

export function PropertySearchWrapper({ onFiltersApply }: PropertySearchWrapperProps) {
  const search = usePropertySearchFilters((filters) => {
    if (onFiltersApply) {
      onFiltersApply(filters);
    }
  });

  const handleSubmit = () => {
    search.submit();
    if (onFiltersApply) {
      onFiltersApply(search.processedFilters);
    }
  };

  return (
    <>
      <div className="hidden lg:block">
        <PropertySearchDesktop 
          {...search} 
          submit={handleSubmit}
        />
      </div>
      
      <div className="lg:hidden">
        <MobilePropertySearch 
          {...search} 
          submit={handleSubmit}
        />
      </div>
    </>
  );
}

export function HomePropertySearchWrapper({ onFiltersApply, home=true }: PropertySearchWrapperProps) {
  const router = useRouter()

  const search = usePropertySearchFilters((filters) => {
    if (onFiltersApply) {
      onFiltersApply(filters);
    }
  });

  const handleSubmit = () => {
    router.push("/properties")
  
  };

  return (
    <>
      <div className="hidden lg:block">
        <PropertySearchDesktop 
          {...search} 
          submit={handleSubmit}
          home={home}
        />
      </div>

      <div className="lg:hidden">
        <MobilePropertySearch 
          {...search} 
          submit={handleSubmit}
        />
      </div>
    </>
  );
}
