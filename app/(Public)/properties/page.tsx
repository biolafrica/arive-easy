import { PropertyCard } from "@/components/cards/public/property";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/primitives/Button";
import { PropertySearchWrapper } from "@/components/propertySearch/PropertySearchWraper";
import { FEATURED_PROPERTIES } from "@/data/property";
import { Property } from "@/type/property";

interface Props {
  properties: Property[];
}

export default function PropertiesPage({ properties }: Props) {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">

        <SectionHeading
          eyebrow="Our Listings"
          title="Featured Properties"
          description="Explore a curated selection of our finest properties, handpicked for their investment potential and unique appeal."
        />

        <div className="mt-10">
          <PropertySearchWrapper/>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Button variant="outline">View more</Button>
        </div>
      </div>
    </section>
  );
}