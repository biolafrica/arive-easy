'use client';

import { ArticleCard } from '@/components/cards/public/article';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/primitives/Button';
import { FeaturedBlogGridSkeleton } from '@/components/skeleton/BlogCardSkeleton';
import { useArticles } from '@/hooks/useSpecialized';
import { ArticleEmptyState } from './ArticleEmptyState';



export const ArticleSection = () => {
  const {articles, isLoading, error } = useArticles({
    include: ['users'],
    sortBy: 'created_at',
    sortOrder: 'desc',
    limit:3
  
  });

  if (error) return <div>Error loading properties</div>;
  return (

    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured Articles"
          title="News and Articles"
          description="Stay informed with the latest trends,tips, and insights in global real estate"
        />

        {isLoading && ( <FeaturedBlogGridSkeleton/>)}

        {!isLoading && articles?.length === 0 && (
          <ArticleEmptyState />
        )}

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((item) => (
            <ArticleCard key={item.id} article={item}  />
          ))}
        </div>

          <div className="mt-14 flex justify-center">
            <Button variant="outline" size="md">
            See all
            </Button>
          </div>
        
      </div>
    </section>
  );
};
