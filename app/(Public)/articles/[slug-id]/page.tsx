import { createMetadata } from "@/components/common/metaData";
import ArticleViewClient from "@/components/sections/public/article/ArticleViewClient";
import { extractUuidFromSlug } from "@/utils/extractUUID";

export const metadata = createMetadata({
  title: "Article Detail",
  description: "Find your perfect home in Nigeria...",
});
export default async function ArticleViewPage({params}:any){
  const { 'slug-id': slugId } = await params;
  const id = extractUuidFromSlug(slugId);

  if (!id) {
    console.error('No valid UUID found in slug:', slugId);
  }

  return(
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <ArticleViewClient id={id}/>
    </div>
  )
}