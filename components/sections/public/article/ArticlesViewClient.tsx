'use client'

import { ArticleCard } from "@/components/cards/public/article";
import { Button } from "@/components/primitives/Button";
import { AllBlogGridSkeleton } from "@/components/skeleton/BlogCardSkeleton";
import { useInfiniteArticles } from "@/hooks/useSpecialized";
import { ArticleEmptyState } from "./ArticleEmptyState";

export default function ArticleViewClient(){

  const {items: articles, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } = useInfiniteArticles({
    include: ['users'],
    sortBy: 'created_at',
    sortOrder: 'desc',
  
  });
  
  if (error) return <div>Error loading properties</div>;

  return(
    <>
      {isLoading && ( <AllBlogGridSkeleton/>)}

      {!isLoading && articles?.length === 0 && (
        <ArticleEmptyState />
      )}

      <div>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((item) => (
            <ArticleCard key={item.id} article={item} />
          ))}
        </div>

        {hasNextPage && (
          <div className="mt-14 flex justify-center">
            <Button variant="outline" size="md" onClick={()=>fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? 'Loading...' : 'View more'}
            </Button>
          </div>
        )}
      </div>

    </>
  )
}