'use client';

import { useState } from 'react';

export type ArticleCategory = 'all' | 'market-trends' | 'financial-planning' ;

export interface ArticleFilterState {
  category: ArticleCategory;
}

export const ARTICLE_CATEGORIES = [
  { value: 'all', label: 'All Articles' },
  { value: 'market-trends', label: 'Market Trends' },
  { value: 'financial-planning', label: 'Financial Planning' },
] as const;

export function useArticleFilter() {
  const [category, setCategory] = useState<ArticleCategory>('all');

  const getProcessedFilters = () => {
    if (category === 'all') {
      return {};
    }
    
    const categoryMap: Record<string, string> = {
      'market-trends': 'Market Trends',
      'financial-planning': 'Financial Planning',
    };

    return {
      category: categoryMap[category] || category,
    };
  };

  return {
    category,
    setCategory,
    filters: getProcessedFilters(),
    categories: ARTICLE_CATEGORIES,
  };
}