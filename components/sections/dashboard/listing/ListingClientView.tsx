'use client'

import { usesellerProperty } from "@/hooks/useSpecialized";
import { SellerPropertyHead } from "../../public/property/PropertyHead";
import SellerPropertyViewTop from "./SellerPropertyViewTop";
import SellerPropertyViewBottom from "./SellerPropertyViewBottom";


export default function ListingClientView({id}:any){
  const {property, isLoading, error,} = usesellerProperty(id);

  return(
    <div>

      {!isLoading && property && (

        <div className="space-y-5">
          <SellerPropertyHead title={property.title} address_full={property.address_full}/>

          <div className="space-y-3">
            <SellerPropertyViewTop/>
            <SellerPropertyViewBottom/>
          </div>
         
        </div>

      )}
      
    </div>
  )
}