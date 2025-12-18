import { useState } from 'react';
import { Select } from './Select';
import { PropertySearchFilters } from './PropertySearchFilter';


export function MobilePropertySearch({
  filters,
  setStatus,
  setState,
  setCity,
  setPropertyType,
  setPriceRange,
  submit,
}: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Collapsed input */}
      <button
        onClick={() => setOpen(true)}
        className="flex h-12 w-full items-center gap-3 rounded-full border border-border bg-white px-4 text-sm text-muted"
      >
        Start your search
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute bottom-0 w-full rounded-t-2xl bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Search Properties</h3>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            {/* Status as select on mobile */}
            <div className='px-4'>
              <Select
                label="Listing Status"
                placeholder="Select status"
                value={filters.status}
                options={['Available', 'Sold', 'Pending']}
                onChange={setStatus}
              />
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
              onSearch={() => {
                submit();
                setOpen(false);
              }}
              showDividers={false}
            />
          </div>
        </div>
      )}
    </>
  );
}



