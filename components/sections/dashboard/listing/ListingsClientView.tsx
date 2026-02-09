'use client';

import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/primitives/Button';
import { DashboardPageHeader } from '../property/seller/SellerPropertyHeader';
import {AllPropertyListingGridSkeleton } from '@/components/skeleton/PropertyCardSkeleton';
import { PropertyEmptyState } from '../../public/property/PropertyEmptyState';
import { useSellerInfiniteProperties } from '@/hooks/useSpecialized';
import { useSidePanel } from '@/hooks/useSidePanel';
import SidePanel from '@/components/ui/SidePanel';
import SellerPropertyDetails from './SellerPropertyDetails';
import { ActiveFiltersBadge, LoadMoreButton, LoadingMoreSkeleton, PropertiesGrid, PropertyStatusFilter } from './ListingComponentUtils';
import SellerPropertyNew from './SellerPropertyNew';
import { Property } from './property-form';


type PropertyStatus = '' |'draft'|'active'|'inactive'|'withdrawn'|'offers'
| 'reserved'| 'inprogress'| 'sold'| 'paused';

interface PropertyFilters {
  status: PropertyStatus;
}

export default function SellerDashboardListingsClientView() {
  const [filters, setFilters] = useState<PropertyFilters>({ status: '' });
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedSearch = useDebounce(searchTerm, 500);
  const detailPanel = useSidePanel<Property>();

  const queryParams = useMemo(() => ({
    filters: filters.status ? { status: filters.status } : {},
    search: debouncedSearch,
    sortBy: 'price',
    sortOrder: 'desc' as const,
  }), [filters.status, debouncedSearch]);

  const { items: properties,  isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refresh,
  } = useSellerInfiniteProperties(queryParams);


  const handleStatusChange = useCallback((status: PropertyStatus) => {
    setFilters({ status });
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ status: '' });
    setSearchTerm('');
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status) count++;
    if (debouncedSearch) count++;
    return count;
  }, [filters.status, debouncedSearch]);

  const handleClose=()=>{
    detailPanel.close()
  }


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-red-500 text-center">
          Error loading properties. Please try again.
        </p>
        <Button onClick={refresh}>Retry</Button>
      </div>
    );
  }

  const hasActiveFilters = activeFilterCount > 0;
  const hasProperties = properties && properties.length > 0;

  return (
    <div className="space-y-6">

      <SidePanel
        isOpen={detailPanel.isOpen}
        onClose={detailPanel.close}
        title={detailPanel.mode === 'edit' ? 'Edit Property' : 'Create New Property'}
      >
        {detailPanel.selectedItem && detailPanel.mode === "edit" ? 
          ( <SellerPropertyDetails property={detailPanel.selectedItem} close={handleClose} />):
          ( <SellerPropertyNew close={handleClose} />)
        }

      </SidePanel>

      <DashboardPageHeader
        title="My Listings"
        description="View and manage your active properties."
        searchPlaceholder="Search properties..."
        onSearch={handleSearchChange}
        filters={<PropertyStatusFilter value={filters.status} onChange={handleStatusChange} />}
        action={ <Button onClick={()=>detailPanel.openAdd}> Upload Properties </Button> }
      />

      {hasActiveFilters && (
        <ActiveFiltersBadge count={activeFilterCount} onClear={handleClearFilters} />
      )}


      {isLoading && <AllPropertyListingGridSkeleton/>}


      {!isLoading && !hasProperties && (
        <PropertyEmptyState hasFilters={hasActiveFilters} onClearFilters={handleClearFilters} />
      )}


      {hasProperties && (
        <>
          <PropertiesGrid properties={properties} onEdit={detailPanel.openEdit}/>
          
          {hasNextPage && (
            <LoadMoreButton isLoading={isFetchingNextPage} onClick={fetchNextPage} />
          )}

          {isFetchingNextPage && <LoadingMoreSkeleton />}
        </>
      )}

    </div>
  );
}

