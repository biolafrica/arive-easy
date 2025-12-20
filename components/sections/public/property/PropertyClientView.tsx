'use client'

import { PropertyActions } from "./PropertyAction";
import { PropertyAmenities } from "./PropertyAmenities";
import PropertyDescription from "./PropertyDescription";
import { PropertyDetails } from "./PropertyDetails";
import { PropertyGallery } from "./PropertyGallery";
import { PropertyPricing } from "./PropetyPricing";
import { useProperty } from "@/hooks/useSpecialized";
import PropertyHead from "./PropertyHead";

export default function PropertyClientView({id}:any){
  const {
    property,
    isLoading,
    error,
  } = useProperty(id);

  if (isLoading) return <div>Loading properties...</div>;
  if (error) return <div>Error loading properties</div>;
  console.log("property:", property)

  return(
    <div>

      {!isLoading && property && (
        <div>
          <PropertyHead title={property.title} address_full={property.address_full}/>
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