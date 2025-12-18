import { PropertyCard } from '@/components/cards/public/property';
import { SectionHeading } from '@/components/common/SectionHeading';
import { PropertyActions } from '@/components/sections/public/property/PropertyAction';
import { PropertyAmenities } from '@/components/sections/public/property/PropertyAmenities';
import PropertyDescription from '@/components/sections/public/property/PropertyDescription';
import { PropertyDetails } from '@/components/sections/public/property/PropertyDetails';
import { PropertyGallery } from '@/components/sections/public/property/PropertyGallery';
import PropertyHead from '@/components/sections/public/property/PropertyHead';
import { PropertyPricing } from '@/components/sections/public/property/PropetyPricing';
import { FEATURED_PROPERTIES, mockSingleProperty } from '@/data/property';


export default function PropertyDetailPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
     <PropertyHead/>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <PropertyGallery
            images={mockSingleProperty.images}
            tours={mockSingleProperty.tours}
          />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <PropertyPricing
            price={mockSingleProperty.price}
            deposit={mockSingleProperty.deposit}
            down_payment={mockSingleProperty.down_payment}
            payment_period={mockSingleProperty.payment_period}
            interest_rate={mockSingleProperty.interest_rate}
          />

          <PropertyDetails
            address_full={mockSingleProperty.address_full}
            area_sqm={mockSingleProperty.area_sqm}
            bedrooms={mockSingleProperty.bedrooms}
            bathrooms={mockSingleProperty.bathrooms}
            property_type={mockSingleProperty.propert_type}
            interior={mockSingleProperty.interior}
          />

          <PropertyDescription description={mockSingleProperty.description}
          />
          <PropertyAmenities
            amenities={mockSingleProperty.amenities}
          />
          <PropertyActions />
        </aside>
      </section>

      <section className="mt-20">
        <SectionHeading
          title="Similar Properties"
          description="Discover other properties that might interest you"
        />

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </main>
  );
}
