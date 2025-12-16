'use client';

import { ArticleCard } from '@/components/cards/public/article';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Button } from '@/components/primitives/Button';
import { ArticleItem } from '@/type/article';
import React from 'react';

interface ArticleSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items: ArticleItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

export const ArticleSection: React.FC<ArticleSectionProps> = ({
  eyebrow = 'Featured',
  title,
  description,
  items,
  ctaLabel = 'View all',
  ctaHref = '/articles',
}) => {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ArticleCard key={item.id} item={item} />
          ))}
        </div>

        {ctaLabel && (
          <div className="mt-14 flex justify-center">
            <Button variant="outline" size="md">
              {ctaLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
