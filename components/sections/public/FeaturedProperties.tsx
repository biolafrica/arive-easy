import { PropertyCard } from "@/components/cards/public/property";
import { Button } from "@/components/primitives/Button";
import { Property } from "@/type/property";


interface Props {
  properties: Property[];
}

export function FeaturedProperties({ properties }: Props) {
  return (
    <section className="py-36 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm text-secondary">Our Listings</p>
          <h2 className="mt-2 text-3xl font-semibold text-heading sm:text-4xl">
            Featured Properties
          </h2>
          <p className="mt-4 text-secondary text-base">
            Explore a curated selection of our finest properties,
            handpicked for their investment potential and unique appeal.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
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
