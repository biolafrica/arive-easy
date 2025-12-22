import ArticleViewClient from "@/components/sections/public/article/ArticleViewClient";

function extractUuidFromSlug(slugId: string): string | null {
  const uuidRegex = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
  
  const match = slugId.match(uuidRegex);
  return match ? match[1] : null;
}


export default async function ArticleViewPage({params}:any){
  const { 'slug-id': slugId } = await params;
  
  console.log('Full slug:', slugId);

  const id = extractUuidFromSlug(slugId);
  
  console.log('Extracted UUID:', id);
  
  // Validate UUID exists
  if (!id) {
    console.error('No valid UUID found in slug:', slugId);
  }

  return(
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <ArticleViewClient id={id}/>
    </div>
  )
}