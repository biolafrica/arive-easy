'use client'

import { ArticleCard } from "@/components/cards/public/article";
import { Button } from "@/components/primitives/Button";
import { AllBlogGridSkeleton } from "@/components/skeleton/BlogCardSkeleton";
import { useInfiniteArticles } from "@/hooks/useSpecialized";
import { ArticleEmptyState } from "./ArticleEmptyState";
import { useArticleFilter } from "@/hooks/useArticleFilter";
import { useEffect } from "react";
import { ArticleCategoryFilter } from "./ArticleCategoryFilter";
import ErrorState from "@/components/feedbacks/ErrorState";

export default function ArticleViewClient(){

  const { category, setCategory, filters } = useArticleFilter();

  const {items: articles, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refresh } = useInfiniteArticles({
    include: ['users'],
    filters: {...filters},
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  useEffect(() => {
    refresh();
  }, [category]);

  if (error) {
    return (
      <ErrorState
        message="Error loading articles"
        retryLabel="Reload articles data"
        onRetry={refresh}
      />
    );
  }

  return(
    <div >

      <div className="mb-8 flex justify-center">
        <ArticleCategoryFilter
          selected={category}
          onChange={setCategory}
          className="mb-8 hidden lg:flex justify-center"
        />
      </div>


      {isLoading && ( <AllBlogGridSkeleton/>)}

      {!isLoading && articles?.length === 0 && (
        <ArticleEmptyState 
          category={category}
          onReset={() => setCategory('all')}
        />
      )}

      
      {articles && articles.length > 0 && (

        <div>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>

          {isFetchingNextPage && (
            <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={`loading-${i}`} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {hasNextPage && !isFetchingNextPage && (
            <div className="mt-14 flex justify-center">
              <Button 
                variant="outline" 
                size="md" 
                onClick={() => fetchNextPage()} 
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Loading...' : 'View more articles'}
              </Button>
            </div>
          )}


        </div>
      )}

    </div>
  )
}