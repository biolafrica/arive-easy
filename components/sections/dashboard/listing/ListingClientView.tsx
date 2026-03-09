'use client'

import { usesellerProperty } from "@/hooks/useSpecialized";
import { SellerPropertyHead } from "../../public/property/PropertyHead";
import SellerPropertyViewTop from "./SellerPropertyViewTop";
import SellerPropertyViewBottom from "./SellerPropertyViewBottom";
import ErrorState from "@/components/feedbacks/ErrorState";


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

        <div className="space-y-5">
          <SellerPropertyHead title={property.title} address_full={property.address_full}/>

          <div className="space-y-3">
            <SellerPropertyViewTop/>
            <SellerPropertyViewBottom id={property.id}/>
          </div>
         
        </div>

      )}
      
    </div>
  )
}