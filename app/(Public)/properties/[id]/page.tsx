import { createMetadata } from '@/components/common/metaData';
import PropertyClientView from '@/components/sections/public/property/PropertyClientView';

export const metadata = createMetadata({
  title: "Property Detail",
  description: "Find your perfect home in Nigeria...",
});

export default async function PropertyDetailPage(
  { params }: { params: Promise<{ id: string }> } 
) {
  const {id} =  await params;
  
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PropertyClientView id={id}/>
    </main>
  );
}
