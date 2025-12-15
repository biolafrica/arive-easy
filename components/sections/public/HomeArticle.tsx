'use client';

import { ArticleCard } from '@/components/cards/public/article';
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
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">

          <p className="text-sm font-medium text-secondary">
            {eyebrow}
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-heading sm:text-4xl">
            {title}
          </h2>

          {description && (
            <p className="mt-4 text-secondary text-lg">
              {description}
            </p>
          )}
        </div>

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
