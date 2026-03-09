'use client'

import { usesellerProperty } from "@/hooks/useSpecialized";
import SellerPropertyViewTop from "./SellerPropertyViewTop";
import SellerPropertyViewBottom from "./SellerPropertyViewBottom";
import ErrorState from "@/components/feedbacks/ErrorState";
import { DescriptionListSkeleton } from "@/components/skeleton/DescriptionListSkeleton";
import { HeaderSkeleton } from "@/utils/skeleton";
import SellerPropertyHead from "./ListingClientViewHeader";


export default function ListingClientView({id}:any){
  const {property, isLoading, error, refresh} = usesellerProperty(id);

  if (error) {
    return (
      <ErrorState
        message="Error loading property details"
        retryLabel="Reload property"
        onRetry={refresh}
      />
    );
  }

  return(
    <div>

      {!isLoading && property && (

        <div>
          <SellerPropertyHead 
            title={property.title} 
            address_full={property.address_full}
            id={property.id}
            status={property.status}
          />

          <div className="space-y-3">
            <SellerPropertyViewTop status={property.status} id={property.id}/>
            <SellerPropertyViewBottom id={property.id}/>
          </div>
        </div>

      )}

      {isLoading && (
        <div className="space-y-5">
          <HeaderSkeleton/>
          <div className="space-y-3">
            <div className="lg:grid grid-cols-5 gap-5">
              <div className="col-span-2 mb-10">
                <DescriptionListSkeleton rows={6}/>
              </div>
              <div className="col-span-3 mb-10">
                <DescriptionListSkeleton rows={6}/>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}