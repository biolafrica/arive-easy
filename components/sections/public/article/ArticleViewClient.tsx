'use client'

import { useArticle } from "@/hooks/useSpecialized";
import ArticleView from "./ArticleView";
import { transformArticle } from "@/utils/articleTransform";

export default function ArticleViewClient({id}:any){
  const {article,isLoading, error,} = useArticle(id);

  if (error) return <div>Error loading properties</div>;

  return(
    <div>
      {!isLoading && article && (
        <ArticleView article={transformArticle(article)}/>
      )}
    </div>
  )
}