import { SectionHeading } from "@/components/common/SectionHeading";
import AllProperties from "@/components/sections/public/property/AllProperties";


export default function PropertiesPage() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">

        <SectionHeading
          eyebrow="Our Listings"
          title="Featured Properties"
          description="Explore a curated selection of our finest properties, handpicked for their investment potential and unique appeal."
        />
        <AllProperties/>

      </div>
    </section>
  );
}