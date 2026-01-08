import { PropertySearchFilters } from "./PropertySearchFilter";

interface PropertySearchDesktopProps {
  filters: any;
  setStatus: (v: any) => void;
  setState: (v?: string) => void;
  setCity: (v?: string) => void;
  setPropertyType: (v?: string) => void;
  setPriceRange: (v?: string) => void;
  submit: () => void;
  home?: boolean;
}

export function PropertySearchDesktop({
  filters,
  setStatus,
  setState,
  setCity,
  setPropertyType,
  setPriceRange,
  submit,
  home = false,
}: PropertySearchDesktopProps) {
  return (
    <>
      <div className="flex gap-2">
        {(['Available', 'Sold', 'Pending'] as const).map((item) => (
          <button
            key={item}
            onClick={() => setStatus(item)}
            className={`rounded-md rounded-b-none px-4 py-2 text-sm font-medium transition
              ${
                filters.status === item
                  ? `bg-layout border border-b-0 ${home? 'text-black' : 'text-black'} shadow-sm`
                  : `  ${home? 'text-white' : 'text-black'}`
              }`}
          >
            {item}
          </button>
        ))}
      </div>

      <PropertySearchFilters
        state={filters.state}
        city={filters.city}
        propertyType={filters.propertyType}
        priceRange={filters.priceRange}
        onStateChange={setState}
        onCityChange={setCity}
        onPropertyTypeChange={setPropertyType}
        onPriceRangeChange={setPriceRange}
        onSearch={submit}
      />
    </>
  );
}

