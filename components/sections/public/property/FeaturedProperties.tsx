'use client'

import { PropertyCard } from "@/components/cards/public/property";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/primitives/Button";
import { FeaturedPropertyGridSkeleton } from "@/components/skeleton/PropertyCardSkeleton";
import { useFeaturedProperties } from "@/hooks/useSpecialized";


export function FeaturedProperties() {

  const { data: featuredProperties, isLoading: loadingFeatured } = useFeaturedProperties();

  return (
    <section className="py-36 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <SectionHeading
          eyebrow="Our Listings"
          title="Featured Properties"
          description="Explore a curated selection of our finest properties, handpicked for their investment potential and unique appeal."
        />
        {loadingFeatured && <FeaturedPropertyGridSkeleton/>}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProperties?.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Button variant="outline">View all</Button>
        </div>
      </div>
    </section>
  );
}
