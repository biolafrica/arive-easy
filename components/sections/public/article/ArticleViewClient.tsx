'use client'

import { useArticle, useRelatedArticles } from "@/hooks/useSpecialized";
import ArticleView from "./ArticleView";
import { transformArticle } from "@/utils/articleTransform";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ArticleCard } from "@/components/cards/public/article";
import { ArticlePageSkeleton } from "@/components/skeleton/BlogCardSkeleton";
import ErrorState from "@/components/feedbacks/ErrorState";

export default function ArticleViewClient({id}:any){
  const {article, isLoading, error,} = useArticle(id);

  const { data: relatedArticles, refetch } = useRelatedArticles(article)

  if (error) {
    return (
      <ErrorState
        message="Error loading article"
        retryLabel="Reload article data"
        onRetry={refetch}
      />
    );
  }

  return(
    <div>
      {isLoading && (<ArticlePageSkeleton/>) }

      {!isLoading && article && (
        <ArticleView article={transformArticle(article)}/>
      )}

      {relatedArticles && relatedArticles.length > 0 && (
        <section className="mt-20">
          <SectionHeading
            title="Related Post"
            description="Stay informed with the latest trends,tips and insights in global real estate"
          />

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

        </section>
      )}
    </div>
  )
}