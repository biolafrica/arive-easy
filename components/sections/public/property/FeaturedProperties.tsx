'use client'

import { PropertyCard } from "@/components/cards/public/property";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/primitives/Button";
import { useFeaturedProperties } from "@/hooks/useSpecialized";
import { PropertyEmptyState } from "./PropertyEmptyState";
import { useRouter } from "next/navigation";
import { PropertyGrid } from "@/components/common/PropertyGrid";



export function FeaturedProperties() {
  const router = useRouter();

  const { data: featuredProperties, isLoading, error, refetch } = useFeaturedProperties();

  return (
    <section className="py-36 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <SectionHeading
          eyebrow="Our Listings"
          title="Featured Properties"
          description="Explore a curated selection of our finest properties, handpicked for their investment potential and unique appeal."
        />

        <PropertyGrid
          items={featuredProperties}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          errorMessage="Error fetching featured properties"
          emptyState={<PropertyEmptyState />}
          renderItem={(property) => (
            <PropertyCard key={property.id} property={property} />
          )}
        />

        <div className="mt-14 flex justify-center">
          <Button variant="outline" onClick={()=>router.push("/properties")}>View all</Button>
        </div>

      </div>
    </section>
  );
}
