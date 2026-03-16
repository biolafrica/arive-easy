'use client';

import { PropertySearchFiltersState, usePropertySearchFilters } from "@/hooks/usePropertySearchFilter";
import { PropertySearchDesktop } from "./PropertySearch";
import { MobilePropertySearch } from "./MobilePropertysearch";
import { useRouter, useSearchParams } from "next/navigation";

interface PropertySearchWrapperProps {
  onFiltersApply?: (filters: any) => void;
  home?: boolean;
}

export function PropertySearchWrapper({ onFiltersApply }: PropertySearchWrapperProps) {
  const searchParams = useSearchParams();

  const initialFilters: Partial<PropertySearchFiltersState> = {};
  const status       = searchParams.get('status')   as PropertySearchFiltersState['status'] | null;
  const state        = searchParams.get('state');
  const city         = searchParams.get('city');
  const propertyType = searchParams.get('propertyType');
  const priceRange   = searchParams.get('priceRange');

  if (status)       initialFilters.status       = status;
  if (state)        initialFilters.state        = state;
  if (city)         initialFilters.city         = city;
  if (propertyType) initialFilters.propertyType = propertyType;
  if (priceRange)   initialFilters.priceRange   = priceRange;

  const search = usePropertySearchFilters((filters) => {
    if (onFiltersApply) onFiltersApply(filters);
  }, initialFilters);

  const handleSubmit = () => {
    search.submit();
    if (onFiltersApply) onFiltersApply(search.processedFilters);
  };

  return (
    <>
      <div className="hidden lg:block">
        <PropertySearchDesktop {...search} submit={handleSubmit} />
      </div>
      
      <div className="lg:hidden">
        <MobilePropertySearch {...search} submit={handleSubmit}/>
      </div>
    </>
  );
}

export function HomePropertySearchWrapper({ onFiltersApply, home=true }: PropertySearchWrapperProps) {
  const router = useRouter()
  const search = usePropertySearchFilters();

  const handleSubmit = () => {
    const { state, city, propertyType, priceRange, status } = search.filters;

    const params = new URLSearchParams();
    if (status)       params.set('status', status);
    if (state)        params.set('state', state);
    if (city)         params.set('city', city);
    if (propertyType) params.set('propertyType', propertyType);
    if (priceRange)   params.set('priceRange', priceRange);

    const qs = params.toString();
    router.push(`/properties${qs ? `?${qs}` : ''}`);
  
  };

  return (
    <>
      <div className="hidden lg:block">
        <PropertySearchDesktop 
          {...search} submit={handleSubmit} home={home} />
      </div>

      <div className="lg:hidden">
        <MobilePropertySearch {...search} submit={handleSubmit} />
      </div>
    </>
  );
}
