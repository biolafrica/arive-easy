'use client'

import { PropertyActions } from "./PropertyAction";
import { PropertyAmenities } from "./PropertyAmenities";
import PropertyDescription from "./PropertyDescription";
import { PropertyDetails } from "./PropertyDetails";
import { PropertyGallery } from "./PropertyGallery";
import { PropertyPricing } from "./PropetyPricing";
import { useProperty, useSimilarProperties } from "@/hooks/useSpecialized";
import PropertyHead from "./PropertyHead";
import { SectionHeading } from "@/components/common/SectionHeading";
import { PropertyCard } from "@/components/cards/public/property";
import { PropertyDetailsPageSkeleton } from "@/components/skeleton/PropertyCardSkeleton";


export default function PropertyClientView({id}:any){
  const {property,isLoading, error,} = useProperty(id);

  const { data: similarProperties } = useSimilarProperties(property)

  if (error) return <div>Error loading properties</div>;

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

      {similarProperties && similarProperties.length > 0 && (
        <section className="mt-20">
          <SectionHeading
            title="Similar Properties"
            description="Discover other properties that might interest you"
          />

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

        </section>
      )}

    </div>
  )
}