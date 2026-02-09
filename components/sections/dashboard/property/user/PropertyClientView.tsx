'use client'

import ErrorState from "@/components/feedbacks/ErrorState";
import { PropertyActions } from "@/components/sections/public/property/PropertyAction";
import { PropertyAmenities } from "@/components/sections/public/property/PropertyAmenities";
import PropertyDescription from "@/components/sections/public/property/PropertyDescription";
import { PropertyDetails } from "@/components/sections/public/property/PropertyDetails";
import { PropertyGallery } from "@/components/sections/public/property/PropertyGallery";
import PropertyHead from "@/components/sections/public/property/PropertyHead";
import { PropertyPricing } from "@/components/sections/public/property/PropetyPricing";
import { PropertyDetailsPageSkeleton } from "@/components/skeleton/PropertyCardSkeleton";
import { usesellerProperty } from "@/hooks/useSpecialized";


export default function UserDashbaordPropertyClientView({id}:any){
  const {property, isLoading, error, refresh} = usesellerProperty(id);

  if (error) {
    return (
      <ErrorState
        message="Error loading property details"
        retryLabel="Reload data"
        onRetry={refresh}
      />
    );
  }


  return(
    <div>
      {isLoading && (<PropertyDetailsPageSkeleton/>) }

       {!isLoading && property && (
        <div>
          <PropertyHead title={property.title} address_full={property.address_full} description={property.description} id={property.id}/>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <PropertyGallery
                images={property.images}
                tours={property.tours}
              />
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24">
              <PropertyPricing
                price={property.price}
                deposit={property.deposit}
                down_payment={property.down_payment}
                payment_period={property.payment_period}
                interest_rate={property.interest_rate}
              />

              <PropertyDetails
                address_full={property.address_full}
                area_sqm={property.area_sqm}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                property_type={property.property_type}
                interior={property.interior}
              />

              <PropertyDescription description={property.description}
              />
              <PropertyAmenities
                amenities={property.amenities}
              />
              <PropertyActions />
            </aside>
          </section>
        </div>
      )}

    </div>
  )
}