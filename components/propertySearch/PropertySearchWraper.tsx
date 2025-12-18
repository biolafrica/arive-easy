'use client';

import { usePropertySearchFilters } from "@/hooks/usePropertySearchFilter";
import { MobilePropertySearch } from "./MobilePropertysearch";
import { PropertySearchDesktop } from "./PropertySearch";


export function PropertySearchWrapper() {
  const search = usePropertySearchFilters();

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <PropertySearchDesktop {...search} />
      </div>

      {/* Mobile */}
      <div className="lg:hidden  ">
        <MobilePropertySearch {...search} />
      </div>
    </>
  );
}
