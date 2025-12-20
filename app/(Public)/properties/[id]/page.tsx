import { PropertyCard } from '@/components/cards/public/property';
import { SectionHeading } from '@/components/common/SectionHeading';
import PropertyClientView from '@/components/sections/public/property/PropertyClientView';
import { FEATURED_PROPERTIES} from '@/data/property';


export default async function PropertyDetailPage({params}:any) {
  const {id} = await params;
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PropertyClientView id={id}/>

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
