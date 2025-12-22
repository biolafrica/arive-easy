import PropertyClientView from '@/components/sections/public/property/PropertyClientView';

export default async function PropertyDetailPage({params}:any) {
  const {id} = await params;
  
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PropertyClientView id={id}/>
    </main>
  );
}
