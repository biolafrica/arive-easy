import { PropertyCard } from '@/components/cards/public/property';
import { SectionHeading } from '@/components/common/SectionHeading';
import { PropertyActions } from '@/components/sections/public/property/PropertyAction';
import { PropertyAmenities } from '@/components/sections/public/property/PropertyAmenities';
import PropertyDescription from '@/components/sections/public/property/PropertyDescription';
import { PropertyDetails } from '@/components/sections/public/property/PropertyDetails';
import { PropertyGallery } from '@/components/sections/public/property/PropertyGallery';
import PropertyHead from '@/components/sections/public/property/PropertyHead';
import { PropertyPricing } from '@/components/sections/public/property/PropetyPricing';
import { FEATURED_PROPERTIES } from '@/data/property';


export default function PropertyDetailPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
     <PropertyHead/>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <PropertyGallery
            images={[ '/images/house-1.jpg', '/images/house-2.jpg', '/images/house-3.jpg', '/images/house-1.jpg',]}
            videoTourUrl='https://bukah.co'
            virtualTourUrl='https://bukah.co'
            
          />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <PropertyPricing
            price="₦500,000,000"
            deposit="₦380,000,000"
            downPayment="₦360,000,000"
            period="4 - 30 years"
            interest="6.7% pa"
          />

          <PropertyDetails
            address="15 Mary Keyes Street, Victoria Island"
            area="1500 sqm"
            bedrooms={4}
            bathrooms={3}
            type="Detached House"
            interior="Fully Furnished"
          />

          <PropertyDescription description="A stunning 4-bedroom residence located in the heart of Victoria Island. This property features modern amenities, spacious rooms, and is perfect for families looking for luxury living in Lagos."
          />
          <PropertyAmenities
            items={[
              'Swimming Pool',
              'Gym / Fitness Center',
              '24/7 Security',
              'Backup Generator',
              'Modern Kitchen',
              'Balcony / Terrace',
            ]}
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
