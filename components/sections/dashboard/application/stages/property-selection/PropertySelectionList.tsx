import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { CITIES_BY_STATE, PROPERTY_TYPES, STATES } from "../../../listing/property-form";
import { AllPropertyGridSkeleton } from "@/components/skeleton/PropertyCardSkeleton";
import { ApplicationPropertyFilters, useApplicationProperties } from "@/hooks/useSpecialized";
import { ExclamationTriangleIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PropertyBase } from "@/type/pages/property";
import { PropertySelectionCard } from "@/components/cards/dashboard/SelectionProperty";
import { formatUSD, toNumber } from "@/lib/formatter";

interface PropertySelectionListProps {
  applicationPropertyId?: string;
  userBuyingPower: number;
  selectedPropertyId: string | null;
  onSelect: (id: string) => void;
  isReadOnly?: boolean;
  isUpdating?: boolean;
}
 
function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={cn(
        'h-8 rounded-lg border border-border bg-white px-2 text-xs text-heading',
        'focus:outline-none focus:ring-2 focus:ring-primary/30 transition',
        'appearance-none cursor-pointer min-w-0 flex-1',
        disabled && 'opacity-40 cursor-not-allowed'
      )}
    >
      <option value="">{placeholder}</option>
      {options
        .filter((o) => !o.disabled && o.value !== '')
        .map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
    </select>
  );
}

export function PropertySelectionList({
  applicationPropertyId,
  userBuyingPower,
  selectedPropertyId,
  onSelect,
  isReadOnly,
  isUpdating,
}: PropertySelectionListProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ApplicationPropertyFilters>({});
 
  const setFilter = (key: keyof ApplicationPropertyFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      // Reset city when state changes
      ...(key === 'state' ? { city: undefined } : {}),
    }));
  };
 
  const clearFilters = () => setFilters({});
 
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
 
  const { properties, isLoading } = useApplicationProperties(
    applicationPropertyId,
    userBuyingPower,
    filters
  );
 
  const cities = useMemo(
    () => CITIES_BY_STATE[filters.state ?? ''] ?? CITIES_BY_STATE[''],
    [filters.state]
  );
 
  if (isLoading) return <AllPropertyGridSkeleton />;

  return(
    <div className="space-y-3">
      {/* ── Filter toggle bar ─────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={cn(
            'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition',
            showFilters || activeFilterCount > 0
              ? 'border-primary bg-primary/8 text-primary'
              : 'border-border bg-white text-secondary hover:border-primary/40 hover:text-heading'
          )}
        >
          <FunnelIcon className="h-3.5 w-3.5" />
          Filter
          {activeFilterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white font-semibold">
              {activeFilterCount}
            </span>
          )}
        </button>
 
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-secondary hover:text-heading transition"
          >
            <XMarkIcon className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
 
        <span className="ml-auto text-xs text-secondary">
          {properties.length} propert{properties.length !== 1 ? 'ies' : 'y'}
        </span>
      </div>
 
      {/* ── Filter row (collapsible) ──────────────────────────── */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-white/60 p-3">
          <FilterSelect
            value={filters.state ?? ''}
            onChange={(v) => setFilter('state', v)}
            options={STATES}
            placeholder="State"
          />
          <FilterSelect
            value={filters.city ?? ''}
            onChange={(v) => setFilter('city', v)}
            options={cities}
            placeholder="City"
            disabled={!filters.state}
          />
          <FilterSelect
            value={filters.propertyType ?? ''}
            onChange={(v) => setFilter('propertyType', v)}
            options={PROPERTY_TYPES}
            placeholder="Property Type"
          />
        </div>
      )}
 
      {/* ── Property grid ─────────────────────────────────────── */}
      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <ExclamationTriangleIcon className="h-10 w-10 text-secondary/40 mb-3" />
          <p className="text-sm font-medium text-heading">No properties found</p>
          <p className="mt-1 text-xs text-secondary">
            {activeFilterCount > 0
              ? 'Try adjusting your filters'
              : 'No properties available at the moment'}
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="mt-3 text-xs text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {properties.map((property: PropertyBase) => (
            <PropertySelectionCard
              key={property.id}
              property={property}
              isSelected={selectedPropertyId === property.id}
              onSelect={onSelect}
              formatPrice={() =>
                formatUSD({ amount: toNumber(property.price), fromCents: false, decimals: 2 })
              }
              disabled={isReadOnly || isUpdating}
            />
          ))}
        </div>
      )}
    </div>
  )
 
}
 